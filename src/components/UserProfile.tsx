
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Target, Activity, Award } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    currentWeight: '',
    goalWeight: '',
    activityLevel: '',
    fitnessGoal: ''
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
  };

  const stats = [
    { label: 'Days Active', value: '0', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Total Workouts', value: '0', icon: <Activity className="h-4 w-4" /> },
    { label: 'Calories Burned', value: '0', icon: <Target className="h-4 w-4" /> },
    { label: 'Achievements', value: '0', icon: <Award className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Your Profile</h2>
        <p className="text-white">Manage your fitness profile and goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your name"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your age"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-white">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your height"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentWeight" className="text-white">Current Weight (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={profile.currentWeight}
                    onChange={(e) => setProfile(prev => ({ ...prev, currentWeight: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter current weight"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalWeight" className="text-white">Goal Weight (kg)</Label>
                  <Input
                    id="goalWeight"
                    type="number"
                    value={profile.goalWeight}
                    onChange={(e) => setProfile(prev => ({ ...prev, goalWeight: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter goal weight"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Fitness Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.fitnessGoal && (
                    <Badge className="bg-blue-600 text-white">{profile.fitnessGoal}</Badge>
                  )}
                  {profile.activityLevel && (
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      Activity Level: {profile.activityLevel}
                    </Badge>
                  )}
                  {!profile.fitnessGoal && !profile.activityLevel && (
                    <p className="text-gray-400 text-sm">Complete your profile to see your fitness goals</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <span className="text-sm text-gray-300">{stat.label}</span>
                    </div>
                    <span className="font-medium text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-4">
                No achievements yet. Start your fitness journey to unlock badges!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
