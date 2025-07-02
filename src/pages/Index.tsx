
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Activity, Users, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import FoodDiary from '@/components/FoodDiary';
import ExerciseLog from '@/components/ExerciseLog';
import UserProfile from '@/components/UserProfile';
import Friends from '@/components/Friends';
import WorkoutSuggestions from '@/components/WorkoutSuggestions';
import LogoutButton from '@/components/LogoutButton';
import DateSelector from '@/components/DateSelector';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date for database queries
  const formatDateForDB = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch daily food logs
  const { data: foodLogs = [] } = useQuery({
    queryKey: ['dailyFoodLogs', formatDateForDB(selectedDate)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_food_logs')
        .select('*')
        .eq('date', formatDateForDB(selectedDate))
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch daily exercise logs
  const { data: exerciseLogs = [] } = useQuery({
    queryKey: ['dailyExerciseLogs', formatDateForDB(selectedDate)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_exercise_logs')
        .select('*')
        .eq('date', formatDateForDB(selectedDate))
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate daily stats
  const totalCaloriesConsumed = foodLogs.reduce((total, log) => total + log.calories, 0);
  const totalCaloriesBurned = exerciseLogs.reduce((total, log) => total + log.calories, 0);
  const caloriesGoal = 2000; // This could be user-configurable later
  const caloriesRemaining = caloriesGoal - totalCaloriesConsumed + totalCaloriesBurned;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header - Centered */}
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
              Your Fitness Journey
            </h1>
            <p className="text-white mt-2">Track, achieve, and celebrate your progress</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex justify-center mb-6">
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
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
              Goal: {caloriesGoal} | Consumed: {totalCaloriesConsumed} | Burned: {totalCaloriesBurned}
            </p>
            <Progress value={caloriesGoal > 0 ? (totalCaloriesConsumed / caloriesGoal) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-blue-600 border-blue-500 hover:shadow-lg transition-shadow text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Exercise Today</CardTitle>
            <Activity className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCaloriesBurned}</div>
            <p className="text-xs text-white">calories burned</p>
            <Badge variant="secondary" className="mt-2 bg-blue-500 text-white">{exerciseLogs.length} workouts completed</Badge>
          </CardContent>
        </Card>

        <Card className="bg-blue-600 border-blue-500 hover:shadow-lg transition-shadow text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Weight Progress</CardTitle>
            <Target className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0 lbs</div>
            <p className="text-xs text-white">
              Goal: 0 lbs | Lost: 0 lbs
            </p>
            <Progress value={0} className="mt-2" />
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
          <CardTitle className="text-lg text-white">Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {foodLogs.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No meals logged yet. Start by logging your first meal!
              </div>
            ) : (
              <div className="space-y-2">
                {foodLogs.slice(0, 3).map((log, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white">{log.food_name}</span>
                    <Badge className="bg-blue-600 text-white">{log.calories} cal</Badge>
                  </div>
                ))}
                {foodLogs.length > 3 && (
                  <p className="text-gray-400 text-sm">...and {foodLogs.length - 3} more items</p>
                )}
              </div>
            )}
            <div className="border-t border-gray-600 pt-2 flex justify-between items-center font-semibold">
              <span className="text-white">Total</span>
              <Badge className="bg-blue-600 text-white">{totalCaloriesConsumed} cal</Badge>
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
            <FoodDiary selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </TabsContent>

          <TabsContent value="exercise">
            <ExerciseLog selectedDate={selectedDate} onDateChange={setSelectedDate} />
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
