
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Target, Activity, Calendar } from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    age: 28,
    height: 68, // inches
    currentWeight: 165,
    goalWeight: 155,
    startWeight: 175,
    activityLevel: 'moderate',
    goal: 'lose_weight',
    gender: 'male'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const calculateBMR = () => {
    // Harris-Benedict Equation
    if (profile.gender === 'male') {
      return Math.round(88.362 + (13.397 * (profile.currentWeight * 0.453592)) + (4.799 * (profile.height * 2.54)) - (5.677 * profile.age));
    } else {
      return Math.round(447.593 + (9.247 * (profile.currentWeight * 0.453592)) + (3.098 * (profile.height * 2.54)) - (4.330 * profile.age));
    }
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return Math.round(bmr * (multipliers[profile.activityLevel] || 1.55));
  };

  const calculateCalorieGoal = () => {
    const tdee = calculateTDEE();
    switch (profile.goal) {
      case 'lose_weight':
        return tdee - 500; // 1 lb per week loss
      case 'gain_weight':
        return tdee + 500; // 1 lb per week gain
      case 'maintain':
      default:
        return tdee;
    }
  };

  const getProgressPercentage = () => {
    const totalLoss = profile.startWeight - profile.goalWeight;
    const currentLoss = profile.startWeight - profile.currentWeight;
    return Math.max(0, Math.min(100, (currentLoss / totalLoss) * 100));
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const updateTempProfile = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-muted-foreground">Manage your fitness goals and preferences</p>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.currentWeight} lbs</div>
                <div className="text-sm opacity-90">Current Weight</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.goalWeight} lbs</div>
                <div className="text-sm opacity-90">Goal Weight</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{calculateCalorieGoal()}</div>
                <div className="text-sm opacity-90">Daily Calorie Goal</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progress Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Starting Weight: {profile.startWeight} lbs</span>
              <span>Goal Weight: {profile.goalWeight} lbs</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {profile.startWeight - profile.currentWeight} lbs lost
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Details</CardTitle>
          <Button 
            variant={isEditing ? "destructive" : "default"}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={isEditing ? tempProfile.name : profile.name}
                onChange={(e) => updateTempProfile('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={isEditing ? tempProfile.email : profile.email}
                onChange={(e) => updateTempProfile('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={isEditing ? tempProfile.age : profile.age}
                onChange={(e) => updateTempProfile('age', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                value={isEditing ? tempProfile.height : profile.height}
                onChange={(e) => updateTempProfile('height', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-weight">Current Weight (lbs)</Label>
              <Input
                id="current-weight"
                type="number"
                value={isEditing ? tempProfile.currentWeight : profile.currentWeight}
                onChange={(e) => updateTempProfile('currentWeight', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-weight">Goal Weight (lbs)</Label>
              <Input
                id="goal-weight"
                type="number"
                value={isEditing ? tempProfile.goalWeight : profile.goalWeight}
                onChange={(e) => updateTempProfile('goalWeight', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={isEditing ? tempProfile.gender : profile.gender}
                onValueChange={(value) => updateTempProfile('gender', value)}
                disabled={!isEditing}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select
                value={isEditing ? tempProfile.activityLevel : profile.activityLevel}
                onValueChange={(value) => updateTempProfile('activityLevel', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                  <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <Select
                value={isEditing ? tempProfile.goal : profile.goal}
                onValueChange={(value) => updateTempProfile('goal', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain_weight">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isEditing && (
              <div className="md:col-span-2 flex gap-4 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculated Values */}
      <Card>
        <CardHeader>
          <CardTitle>Calculated Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">{calculateBMR()}</div>
              <div className="text-sm text-muted-foreground">Basal Metabolic Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{calculateTDEE()}</div>
              <div className="text-sm text-muted-foreground">Total Daily Energy Expenditure</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">{calculateCalorieGoal()}</div>
              <div className="text-sm text-muted-foreground">Daily Calorie Goal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
