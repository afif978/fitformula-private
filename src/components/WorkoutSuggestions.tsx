
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Zap, Users, Heart, Dumbbell } from 'lucide-react';

const WorkoutSuggestions = () => {
  const workoutPlans = [
    {
      title: "Beginner Full Body",
      duration: "30 min",
      difficulty: "Beginner",
      exercises: ["Push-ups", "Squats", "Plank", "Lunges"],
      calories: "150-200",
      icon: <Target className="h-5 w-5" />
    },
    {
      title: "HIIT Cardio Blast",
      duration: "20 min",
      difficulty: "Intermediate",
      exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "High Knees"],
      calories: "200-300",
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: "Strength Training",
      duration: "45 min",
      difficulty: "Advanced",
      exercises: ["Deadlifts", "Bench Press", "Squats", "Pull-ups"],
      calories: "250-350",
      icon: <Dumbbell className="h-5 w-5" />
    },
    {
      title: "Core & Flexibility",
      duration: "25 min",
      difficulty: "Beginner",
      exercises: ["Planks", "Russian Twists", "Leg Raises", "Stretching"],
      calories: "100-150",
      icon: <Heart className="h-5 w-5" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Workout Suggestions</h2>
        <p className="text-white">Choose from our curated workout plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workoutPlans.map((workout, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {workout.icon}
                {workout.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{workout.duration}</span>
                </div>
                <Badge className={getDifficultyColor(workout.difficulty)}>
                  {workout.difficulty}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-white">Exercises:</h4>
                <div className="flex flex-wrap gap-2">
                  {workout.exercises.map((exercise, idx) => (
                    <Badge key={idx} variant="outline" className="border-gray-600 text-gray-300">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Estimated: {workout.calories} cal
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Community Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-600 rounded-lg">
              <h4 className="font-medium text-white">30-Day Push-up Challenge</h4>
              <p className="text-sm text-gray-400 mt-1">Build upper body strength progressively</p>
              <Button variant="outline" className="mt-2 w-full border-gray-600 text-white hover:bg-gray-700">
                Join Challenge
              </Button>
            </div>
            <div className="p-4 border border-gray-600 rounded-lg">
              <h4 className="font-medium text-white">Weekly Step Goal</h4>
              <p className="text-sm text-gray-400 mt-1">Walk 10,000 steps daily this week</p>
              <Button variant="outline" className="mt-2 w-full border-gray-600 text-white hover:bg-gray-700">
                Join Challenge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutSuggestions;
