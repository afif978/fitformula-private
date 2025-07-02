
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Plus, Clock, Flame, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import DateSelector from './DateSelector';

interface ExerciseLogProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ExerciseLog = ({ selectedDate, onDateChange }: ExerciseLogProps) => {
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: '',
    duration: '',
    calories: '',
    intensity: ''
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const formatDateForDB = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch daily exercise logs
  const { data: exercises = [] } = useQuery({
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

  // Add exercise mutation
  const addExerciseMutation = useMutation({
    mutationFn: async (exerciseData: any) => {
      const { error } = await supabase
        .from('daily_exercise_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          date: formatDateForDB(selectedDate),
          ...exerciseData
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyExerciseLogs'] });
      toast({ title: "Exercise added successfully!" });
      setNewExercise({
        name: '',
        type: '',
        duration: '',
        calories: '',
        intensity: ''
      });
    },
    onError: () => {
      toast({ title: "Error adding exercise", variant: "destructive" });
    }
  });

  // Remove exercise mutation
  const removeExerciseMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('daily_exercise_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyExerciseLogs'] });
      toast({ title: "Exercise removed successfully!" });
    },
    onError: () => {
      toast({ title: "Error removing exercise", variant: "destructive" });
    }
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

      addExerciseMutation.mutate({
        exercise_name: newExercise.name,
        exercise_type: selectedExercise?.type || 'Other',
        duration: parseInt(newExercise.duration),
        calories: estimatedCalories,
        intensity: newExercise.intensity
      });
    }
  };

  const removeExercise = (logId: string) => {
    removeExerciseMutation.mutate(logId);
  };

  const getTotalCaloriesBurned = () => {
    return exercises.reduce((total, exercise) => total + exercise.calories, 0);
  };

  const getTotalDuration = () => {
    return exercises.reduce((total, exercise) => total + exercise.duration, 0);
  };

  const getIntensityColor = (intensity: string) => {
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
        <h2 className="text-2xl font-bold text-white">Exercise Log</h2>
        <p className="text-white">Track your workouts and stay active</p>
      </div>

      {/* Date Selector */}
      <div className="flex justify-center">
        <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
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
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Plus className="h-5 w-5" />
            Log New Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name" className="text-white">Exercise</Label>
              <Select value={newExercise.name} onValueChange={(value) => setNewExercise(prev => ({ ...prev, name: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {exerciseTypes.map((exercise, index) => (
                    <SelectItem key={index} value={exercise.name} className="text-white hover:bg-gray-700">
                      {exercise.name} ({exercise.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={newExercise.duration}
                onChange={(e) => setNewExercise(prev => ({ ...prev, duration: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensity" className="text-white">Intensity</Label>
              <Select value={newExercise.intensity} onValueChange={(value) => setNewExercise(prev => ({ ...prev, intensity: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Low" className="text-white hover:bg-gray-700">Low</SelectItem>
                  <SelectItem value="Moderate" className="text-white hover:bg-gray-700">Moderate</SelectItem>
                  <SelectItem value="High" className="text-white hover:bg-gray-700">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={addExercise} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Exercise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Today's Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{exercise.exercise_name}</div>
                    <div className="text-sm text-gray-400">
                      {exercise.duration} min • {new Date(exercise.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-white">{exercise.calories} cal</Badge>
                  <Badge className={getIntensityColor(exercise.intensity)}>
                    {exercise.intensity}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeExercise(exercise.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="text-center text-gray-400 py-8">
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
