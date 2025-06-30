
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Plus, Clock, Flame } from 'lucide-react';

const ExerciseLog = () => {
  const [exercises, setExercises] = useState([
    { 
      name: 'Morning Run', 
      type: 'Cardio', 
      duration: 30, 
      calories: 250, 
      time: '7:00 AM',
      intensity: 'Moderate'
    },
    { 
      name: 'Weight Training', 
      type: 'Strength', 
      duration: 45, 
      calories: 200, 
      time: '6:00 PM',
      intensity: 'High'
    }
  ]);

  const [newExercise, setNewExercise] = useState({
    name: '',
    type: '',
    duration: '',
    calories: '',
    intensity: ''
  });

  const exerciseTypes = [
    { name: 'Running', type: 'Cardio', caloriesPerMin: 10 },
    { name: 'Cycling', type: 'Cardio', caloriesPerMin: 8 },
    { name: 'Swimming', type: 'Cardio', caloriesPerMin: 12 },
    { name: 'Weight Training', type: 'Strength', caloriesPerMin: 6 },
    { name: 'Yoga', type: 'Flexibility', caloriesPerMin: 3 },
    { name: 'Walking', type: 'Cardio', caloriesPerMin: 4 },
    { name: 'HIIT', type: 'Cardio', caloriesPerMin: 15 },
    { name: 'Pilates', type: 'Strength', caloriesPerMin: 4 }
  ];

  const addExercise = () => {
    if (newExercise.name && newExercise.duration) {
      const selectedExercise = exerciseTypes.find(ex => ex.name === newExercise.name);
      const estimatedCalories = selectedExercise 
        ? selectedExercise.caloriesPerMin * parseInt(newExercise.duration)
        : parseInt(newExercise.calories) || 0;

      setExercises(prev => [...prev, {
        ...newExercise,
        duration: parseInt(newExercise.duration),
        calories: estimatedCalories,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: selectedExercise?.type || 'Other'
      }]);

      setNewExercise({
        name: '',
        type: '',
        duration: '',
        calories: '',
        intensity: ''
      });
    }
  };

  const getTotalCaloriesBurned = () => {
    return exercises.reduce((total, exercise) => total + exercise.calories, 0);
  };

  const getTotalDuration = () => {
    return exercises.reduce((total, exercise) => total + exercise.duration, 0);
  };

  const getIntensityColor = (intensity) => {
    switch (intensity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Exercise Log</h2>
        <p className="text-muted-foreground">Track your workouts and stay active</p>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{getTotalCaloriesBurned()}</div>
                <div className="text-sm opacity-90">calories burned</div>
              </div>
              <Flame className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{getTotalDuration()}</div>
                <div className="text-sm opacity-90">minutes active</div>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log New Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise</Label>
              <Select value={newExercise.name} onValueChange={(value) => setNewExercise(prev => ({ ...prev, name: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseTypes.map((exercise, index) => (
                    <SelectItem key={index} value={exercise.name}>
                      {exercise.name} ({exercise.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={newExercise.duration}
                onChange={(e) => setNewExercise(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensity">Intensity</Label>
              <Select value={newExercise.intensity} onValueChange={(value) => setNewExercise(prev => ({ ...prev, intensity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={addExercise} className="w-full">
                Add Exercise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.duration} min • {exercise.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{exercise.calories} cal</Badge>
                  <Badge className={getIntensityColor(exercise.intensity)}>
                    {exercise.intensity}
                  </Badge>
                </div>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No exercises logged today. Start your fitness journey!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseLog;
