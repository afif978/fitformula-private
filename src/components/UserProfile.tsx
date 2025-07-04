
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Target, Activity, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          // Use type assertion to access the new columns
          const profileData = data as any;
          setProfile({
            name: profileData.full_name || '',
            email: profileData.email || user.email || '',
            age: profileData.age?.toString() || '',
            height: profileData.height?.toString() || '',
            currentWeight: profileData.current_weight?.toString() || '',
            goalWeight: profileData.goal_weight?.toString() || '',
            activityLevel: profileData.activity_level || '',
            fitnessGoal: profileData.fitness_goal || ''
          });
        } else {
          setProfile(prev => ({ ...prev, email: user.email || '' }));
        }
      }
    } catch (error: any) {
      console.error('Load profile error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const profileData = {
        id: user.id,
        full_name: profile.name,
        email: profile.email,
        age: profile.age ? parseInt(profile.age) : null,
        height: profile.height ? parseInt(profile.height) : null,
        current_weight: profile.currentWeight ? parseFloat(profile.currentWeight) : null,
        goal_weight: profile.goalWeight ? parseFloat(profile.goalWeight) : null,
        activity_level: profile.activityLevel,
        fitness_goal: profile.fitnessGoal,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully!'
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Save profile error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                {isEditing ? (loading ? 'Saving...' : 'Save') : 'Edit'}
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
                    disabled={true}
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
                <div className="space-y-2">
                  <Label htmlFor="activityLevel" className="text-white">Activity Level</Label>
                  <Input
                    id="activityLevel"
                    value={profile.activityLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, activityLevel: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., Sedentary, Active, Very Active"
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal" className="text-white">Fitness Goal</Label>
                  <Input
                    id="fitnessGoal"
                    value={profile.fitnessGoal}
                    onChange={(e) => setProfile(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., Weight Loss, Muscle Gain, Endurance"
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
