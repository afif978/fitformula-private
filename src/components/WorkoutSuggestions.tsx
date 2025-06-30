
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, Flame, Play, CheckCircle } from 'lucide-react';

const WorkoutSuggestions = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState(new Set());

  const workoutPlans = {
    weight_loss: [
      {
        id: 1,
        title: '5-Day Fat Burning Cardio',
        description: 'High-intensity cardio workouts to maximize calorie burn',
        duration: '30-45 min',
        difficulty: 'Beginner',
        workouts: [
          { day: 1, name: 'HIIT Treadmill', duration: 30, calories: 300 },
          { day: 2, name: 'Cycling Intervals', duration: 35, calories: 280 },
          { day: 3, name: 'Swimming Laps', duration: 40, calories: 350 },
          { day: 4, name: 'Dance Cardio', duration: 30, calories: 250 },
          { day: 5, name: 'Rowing Machine', duration: 25, calories: 275 }
        ]
      },
      {
        id: 2,
        title: 'Circuit Training Blast',
        description: 'Full-body circuits combining cardio and strength',
        duration: '40-50 min',
        difficulty: 'Intermediate',
        workouts: [
          { day: 1, name: 'Upper Body Circuit', duration: 45, calories: 320 },
          { day: 2, name: 'Lower Body Blast', duration: 40, calories: 300 },
          { day: 3, name: 'Core & Cardio Mix', duration: 35, calories: 280 },
          { day: 4, name: 'Full Body HIIT', duration: 50, calories: 400 }
        ]
      }
    ],
    muscle_gain: [
      {
        id: 3,
        title: '3-Day Beginner Strength',
        description: 'Build muscle with compound movements and progressive overload',
        duration: '45-60 min',
        difficulty: 'Beginner',
        workouts: [
          { day: 1, name: 'Push Day (Chest, Shoulders, Triceps)', duration: 60, calories: 200 },
          { day: 2, name: 'Pull Day (Back, Biceps)', duration: 55, calories: 180 },
          { day: 3, name: 'Legs Day (Quads, Hamstrings, Glutes)', duration: 65, calories: 220 }
        ]
      },
      {
        id: 4,
        title: '5-Day Upper/Lower Split',
        description: 'Advanced muscle building program with higher volume',
        duration: '60-75 min',
        difficulty: 'Advanced',
        workouts: [
          { day: 1, name: 'Upper Body Power', duration: 70, calories: 250 },
          { day: 2, name: 'Lower Body Power', duration: 75, calories: 280 },
          { day: 3, name: 'Upper Body Hypertrophy', duration: 65, calories: 230 },
          { day: 4, name: 'Lower Body Hypertrophy', duration: 70, calories: 260 },
          { day: 5, name: 'Full Body Accessory', duration: 60, calories: 220 }
        ]
      }
    ],
    general_fitness: [
      {
        id: 5,
        title: 'Balanced Fitness Routine',
        description: 'Mix of cardio, strength, and flexibility for overall health',
        duration: '30-45 min',
        difficulty: 'Beginner',
        workouts: [
          { day: 1, name: 'Full Body Strength', duration: 45, calories: 250 },
          { day: 2, name: 'Cardio & Core', duration: 35, calories: 280 },
          { day: 3, name: 'Yoga & Stretching', duration: 30, calories: 120 },
          { day: 4, name: 'HIIT Training', duration: 25, calories: 300 }
        ]
      },
      {
        id: 6,
        title: 'Active Lifestyle Program',
        description: 'Sustainable workouts for busy schedules',
        duration: '20-30 min',
        difficulty: 'Beginner',
        workouts: [
          { day: 1, name: 'Morning Yoga Flow', duration: 20, calories: 100 },
          { day: 2, name: 'Bodyweight Strength', duration: 25, calories: 150 },
          { day: 3, name: 'Walk & Jog Intervals', duration: 30, calories: 200 },
          { day: 4, name: 'Core & Flexibility', duration: 20, calories: 80 }
        ]
      }
    ]
  };

  const startWorkout = (workoutId, workoutIndex) => {
    const workoutKey = `${workoutId}-${workoutIndex}`;
    setCompletedWorkouts(prev => new Set([...prev, workoutKey]));
  };

  const isWorkoutCompleted = (workoutId, workoutIndex) => {
    return completedWorkouts.has(`${workoutId}-${workoutIndex}`);
  };

  const getCompletionPercentage = (plan) => {
    const totalWorkouts = plan.workouts.length;
    const completed = plan.workouts.filter((_, index) => 
      isWorkoutCompleted(plan.id, index)
    ).length;
    return (completed / totalWorkouts) * 100;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderWorkoutPlan = (plan) => (
    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {plan.title}
              <Badge className={getDifficultyColor(plan.difficulty)}>
                {plan.difficulty}
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground mt-2">{plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {plan.duration}
            </div>
          </div>
        </div>
        <Progress value={getCompletionPercentage(plan)} className="mt-4" />
        <div className="text-sm text-muted-foreground">
          {plan.workouts.filter((_, index) => isWorkoutCompleted(plan.id, index)).length} of {plan.workouts.length} workouts completed
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {plan.workouts.map((workout, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                isWorkoutCompleted(plan.id, index) ? 'bg-green-50 border-green-200' : 'hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isWorkoutCompleted(plan.id, index) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary text-white'
                }`}>
                  {isWorkoutCompleted(plan.id, index) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-bold">{workout.day}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {workout.calories} cal
                    </span>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant={isWorkoutCompleted(plan.id, index) ? "secondary" : "default"}
                    disabled={isWorkoutCompleted(plan.id, index)}
                  >
                    {isWorkoutCompleted(plan.id, index) ? (
                      'Completed'
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{workout.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{workout.duration}</div>
                        <div className="text-sm text-muted-foreground">Minutes</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{workout.calories}</div>
                        <div className="text-sm text-muted-foreground">Calories</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Workout Instructions:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Warm up for 5 minutes before starting</li>
                        <li>• Follow the exercise routine with proper form</li>
                        <li>• Take 30-60 second breaks between exercises</li>
                        <li>• Cool down and stretch for 5 minutes after</li>
                        <li>• Stay hydrated throughout the workout</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => startWorkout(plan.id, index)}
                      className="w-full"
                    >
                      Complete Workout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Workout Suggestions</h2>
        <p className="text-muted-foreground">Personalized workout plans based on your fitness goals</p>
      </div>

      <Tabs defaultValue="weight_loss" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weight_loss" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Weight Loss
          </TabsTrigger>
          <TabsTrigger value="muscle_gain" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Muscle Gain
          </TabsTrigger>
          <TabsTrigger value="general_fitness" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            General Fitness
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weight_loss" className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg">
            <h3 className="text-xl font-bold mb-2">🔥 Weight Loss Programs</h3>
            <p className="opacity-90">High-intensity workouts designed to maximize calorie burn and fat loss</p>
          </div>
          {workoutPlans.weight_loss.map(renderWorkoutPlan)}
        </TabsContent>

        <TabsContent value="muscle_gain" className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
            <h3 className="text-xl font-bold mb-2">💪 Muscle Building Programs</h3>
            <p className="opacity-90">Strength training routines focused on building lean muscle mass</p>
          </div>
          {workoutPlans.muscle_gain.map(renderWorkoutPlan)}
        </TabsContent>

        <TabsContent value="general_fitness" className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg">
            <h3 className="text-xl font-bold mb-2">🌟 General Fitness Programs</h3>
            <p className="opacity-90">Balanced routines for overall health, flexibility, and wellness</p>
          </div>
          {workoutPlans.general_fitness.map(renderWorkoutPlan)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutSuggestions;
