
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Activity, Users, Utensils } from 'lucide-react';
import FoodDiary from '@/components/FoodDiary';
import ExerciseLog from '@/components/ExerciseLog';
import UserProfile from '@/components/UserProfile';
import Friends from '@/components/Friends';
import WorkoutSuggestions from '@/components/WorkoutSuggestions';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStats] = useState({
    caloriesConsumed: 1450,
    caloriesGoal: 2000,
    exerciseCaloriesBurned: 350,
    currentWeight: 165,
    goalWeight: 155,
    startWeight: 175
  });

  const caloriesRemaining = userStats.caloriesGoal - userStats.caloriesConsumed + userStats.exerciseCaloriesBurned;
  const progressPercentage = ((userStats.startWeight - userStats.currentWeight) / (userStats.startWeight - userStats.goalWeight)) * 100;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Your Fitness Journey
        </h1>
        <p className="text-muted-foreground mt-2">Track, achieve, and celebrate your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Calories Remaining</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{caloriesRemaining}</div>
            <p className="text-xs text-muted-foreground">
              Goal: {userStats.caloriesGoal} | Consumed: {userStats.caloriesConsumed} | Burned: {userStats.exerciseCaloriesBurned}
            </p>
            <Progress value={(userStats.caloriesConsumed / userStats.caloriesGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Exercise Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userStats.exerciseCaloriesBurned}</div>
            <p className="text-xs text-muted-foreground">calories burned</p>
            <Badge variant="secondary" className="mt-2">2 workouts completed</Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Weight Progress</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{userStats.currentWeight} lbs</div>
            <p className="text-xs text-muted-foreground">
              Goal: {userStats.goalWeight} lbs | Lost: {userStats.startWeight - userStats.currentWeight} lbs
            </p>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          onClick={() => setActiveTab('food')} 
          className="h-20 flex-col bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Utensils className="h-6 w-6 mb-2" />
          Log Food
        </Button>
        <Button 
          onClick={() => setActiveTab('exercise')} 
          className="h-20 flex-col bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Activity className="h-6 w-6 mb-2" />
          Log Exercise
        </Button>
        <Button 
          onClick={() => setActiveTab('workouts')} 
          className="h-20 flex-col bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        >
          <Target className="h-6 w-6 mb-2" />
          Workouts
        </Button>
        <Button 
          onClick={() => setActiveTab('friends')} 
          className="h-20 flex-col bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Users className="h-6 w-6 mb-2" />
          Friends
        </Button>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Breakfast</span>
              <Badge variant="outline">420 cal</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Lunch</span>
              <Badge variant="outline">650 cal</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Dinner</span>
              <Badge variant="outline">380 cal</Badge>
            </div>
            <div className="border-t pt-2 flex justify-between items-center font-semibold">
              <span>Total</span>
              <Badge>{userStats.caloriesConsumed} cal</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="food">Food Diary</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="food">
            <FoodDiary />
          </TabsContent>

          <TabsContent value="exercise">
            <ExerciseLog />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutSuggestions />
          </TabsContent>

          <TabsContent value="friends">
            <Friends />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
