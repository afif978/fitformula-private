
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
import LogoutButton from '@/components/LogoutButton';

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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">
            Your Fitness Journey
          </h1>
          <LogoutButton />
        </div>
        <p className="text-white mt-2">Track, achieve, and celebrate your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-600 border-blue-500 hover:shadow-lg transition-shadow text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Calories Remaining</CardTitle>
            <Target className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{caloriesRemaining}</div>
            <p className="text-xs text-white">
              Goal: {userStats.caloriesGoal} | Consumed: {userStats.caloriesConsumed} | Burned: {userStats.exerciseCaloriesBurned}
            </p>
            <Progress value={(userStats.caloriesConsumed / userStats.caloriesGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-blue-600 border-blue-500 hover:shadow-lg transition-shadow text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Exercise Today</CardTitle>
            <Activity className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.exerciseCaloriesBurned}</div>
            <p className="text-xs text-white">calories burned</p>
            <Badge variant="secondary" className="mt-2 bg-blue-500 text-white">2 workouts completed</Badge>
          </CardContent>
        </Card>

        <Card className="bg-blue-600 border-blue-500 hover:shadow-lg transition-shadow text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Weight Progress</CardTitle>
            <Target className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.currentWeight} lbs</div>
            <p className="text-xs text-white">
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
          className="h-20 flex-col bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Utensils className="h-6 w-6 mb-2" />
          Log Food
        </Button>
        <Button 
          onClick={() => setActiveTab('exercise')} 
          className="h-20 flex-col bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Activity className="h-6 w-6 mb-2" />
          Log Exercise
        </Button>
        <Button 
          onClick={() => setActiveTab('workouts')} 
          className="h-20 flex-col bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Target className="h-6 w-6 mb-2" />
          Workouts
        </Button>
        <Button 
          onClick={() => setActiveTab('friends')} 
          className="h-20 flex-col bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Users className="h-6 w-6 mb-2" />
          Friends
        </Button>
      </div>

      {/* Today's Summary */}
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white">Breakfast</span>
              <Badge variant="outline" className="border-gray-600 text-white">420 cal</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Lunch</span>
              <Badge variant="outline" className="border-gray-600 text-white">650 cal</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Dinner</span>
              <Badge variant="outline" className="border-gray-600 text-white">380 cal</Badge>
            </div>
            <div className="border-t border-gray-600 pt-2 flex justify-between items-center font-semibold">
              <span className="text-white">Total</span>
              <Badge className="bg-blue-600 text-white">{userStats.caloriesConsumed} cal</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-700 border-gray-600">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="food" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Food Diary</TabsTrigger>
            <TabsTrigger value="exercise" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Exercise</TabsTrigger>
            <TabsTrigger value="workouts" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Workouts</TabsTrigger>
            <TabsTrigger value="friends" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Friends</TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Profile</TabsTrigger>
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
