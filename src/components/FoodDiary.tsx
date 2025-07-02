import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Utensils, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import DateSelector from './DateSelector';

interface FoodDiaryProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const FoodDiary = ({ selectedDate, onDateChange }: FoodDiaryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  // Add food mutation
  const addFoodMutation = useMutation({
    mutationFn: async ({ food, mealType }: { food: any, mealType: string }) => {
      const { error } = await supabase
        .from('daily_food_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          date: formatDateForDB(selectedDate),
          meal_type: mealType,
          food_name: food.name,
          calories: food.calories,
          serving: food.serving
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyFoodLogs'] });
      toast({ title: "Food added successfully!" });
    },
    onError: () => {
      toast({ title: "Error adding food", variant: "destructive" });
    }
  });

  // Remove food mutation
  const removeFoodMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('daily_food_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyFoodLogs'] });
      toast({ title: "Food removed successfully!" });
    },
    onError: () => {
      toast({ title: "Error removing food", variant: "destructive" });
    }
  });

  // Comprehensive food database for search
  const foodDatabase = [
    // Fruits
    { name: 'Apple', calories: 95, serving: '1 medium' },
    { name: 'Banana', calories: 105, serving: '1 medium' },
    { name: 'Orange', calories: 62, serving: '1 medium' },
    { name: 'Grapes', calories: 62, serving: '1 cup' },
    { name: 'Strawberries', calories: 49, serving: '1 cup' },
    { name: 'Blueberries', calories: 84, serving: '1 cup' },
    { name: 'Avocado', calories: 234, serving: '1 whole' },
    { name: 'Pear', calories: 102, serving: '1 medium' },
    { name: 'Peach', calories: 59, serving: '1 medium' },
    { name: 'Pineapple', calories: 82, serving: '1 cup chunks' },
    
    // Vegetables
    { name: 'Broccoli', calories: 55, serving: '1 cup' },
    { name: 'Spinach', calories: 7, serving: '1 cup' },
    { name: 'Carrots', calories: 52, serving: '1 cup' },
    { name: 'Bell Pepper', calories: 31, serving: '1 cup' },
    { name: 'Tomato', calories: 32, serving: '1 medium' },
    { name: 'Cucumber', calories: 16, serving: '1 cup sliced' },
    { name: 'Lettuce', calories: 10, serving: '2 cups' },
    { name: 'Cauliflower', calories: 25, serving: '1 cup' },
    { name: 'Zucchini', calories: 20, serving: '1 cup sliced' },
    { name: 'Sweet Potato', calories: 112, serving: '1 medium' },
    
    // Proteins
    { name: 'Chicken Breast', calories: 165, serving: '3.5 oz' },
    { name: 'Salmon Fillet', calories: 206, serving: '3.5 oz' },
    { name: 'Ground Turkey', calories: 125, serving: '3.5 oz' },
    { name: 'Eggs', calories: 70, serving: '1 large' },
    { name: 'Greek Yogurt', calories: 130, serving: '1 cup' },
    { name: 'Tuna', calories: 154, serving: '3.5 oz' },
    { name: 'Lean Beef', calories: 250, serving: '3.5 oz' },
    { name: 'Tofu', calories: 94, serving: '3.5 oz' },
    { name: 'Cottage Cheese', calories: 98, serving: '1/2 cup' },
    { name: 'Shrimp', calories: 99, serving: '3.5 oz' },
    
    // Grains & Carbs
    { name: 'Brown Rice', calories: 112, serving: '1/2 cup cooked' },
    { name: 'Quinoa', calories: 111, serving: '1/2 cup cooked' },
    { name: 'Oatmeal', calories: 150, serving: '1 cup cooked' },
    { name: 'Whole Wheat Bread', calories: 80, serving: '1 slice' },
    { name: 'Sweet Potato', calories: 112, serving: '1 medium' },
    { name: 'Pasta', calories: 220, serving: '1 cup cooked' },
    { name: 'White Rice', calories: 130, serving: '1/2 cup cooked' },
    { name: 'Bagel', calories: 245, serving: '1 small' },
    
    // Nuts & Seeds
    { name: 'Almonds', calories: 160, serving: '1 oz (23 nuts)' },
    { name: 'Walnuts', calories: 185, serving: '1 oz' },
    { name: 'Peanut Butter', calories: 190, serving: '2 tbsp' },
    { name: 'Chia Seeds', calories: 140, serving: '1 oz' },
    { name: 'Cashews', calories: 157, serving: '1 oz' },
    { name: 'Sunflower Seeds', calories: 165, serving: '1 oz' },
    
    // Dairy
    { name: 'Milk (2%)', calories: 122, serving: '1 cup' },
    { name: 'Cheddar Cheese', calories: 113, serving: '1 oz' },
    { name: 'Mozzarella', calories: 85, serving: '1 oz' },
    { name: 'Yogurt', calories: 150, serving: '1 cup' },
    
    // Beverages
    { name: 'Green Tea', calories: 2, serving: '1 cup' },
    { name: 'Coffee (black)', calories: 2, serving: '1 cup' },
    { name: 'Orange Juice', calories: 112, serving: '1 cup' },
    { name: 'Protein Shake', calories: 120, serving: '1 scoop' },
    
    // Snacks
    { name: 'Dark Chocolate', calories: 170, serving: '1 oz' },
    { name: 'Granola Bar', calories: 120, serving: '1 bar' },
    { name: 'Rice Cakes', calories: 35, serving: '1 cake' },
    { name: 'Hummus', calories: 25, serving: '1 tbsp' },
    { name: 'Crackers', calories: 16, serving: '1 cracker' }
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFoodToMeal = (food: any, mealType: string) => {
    addFoodMutation.mutate({ food, mealType });
  };

  const removeFoodFromMeal = (logId: string) => {
    removeFoodMutation.mutate(logId);
  };

  const getMealLogs = (mealType: string) => {
    return foodLogs.filter(log => log.meal_type === mealType);
  };

  const getTotalCalories = (mealType: string) => {
    return getMealLogs(mealType).reduce((total, log) => total + log.calories, 0);
  };

  const getTotalDayCalories = () => {
    return foodLogs.reduce((total, log) => total + log.calories, 0);
  };

  const renderMealSection = (mealType: string, title: string, icon: React.ReactNode) => {
    const mealLogs = getMealLogs(mealType);
    
    return (
      <Card key={mealType} className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            {icon}
            {title}
            <Badge variant="secondary" className="bg-blue-600 text-white">{getTotalCalories(mealType)} cal</Badge>
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setSelectedMeal(mealType)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-1" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add Food to {title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer"
                      onClick={() => addFoodToMeal(food, mealType)}
                    >
                      <div>
                        <div className="font-medium text-white">{food.name}</div>
                        <div className="text-sm text-gray-400">{food.serving}</div>
                      </div>
                      <Badge className="bg-blue-600 text-white">{food.calories} cal</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mealLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0">
                <div>
                  <div className="font-medium text-white">{log.food_name}</div>
                  <div className="text-sm text-gray-400">{log.serving}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-white">{log.calories} cal</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFoodFromMeal(log.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {mealLogs.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                No foods logged yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Food Diary</h2>
        <p className="text-white">Track your daily nutrition</p>
      </div>

      {/* Date Selector */}
      <div className="flex justify-center">
        <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
      </div>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{getTotalDayCalories()}</div>
            <div className="text-sm opacity-90">calories consumed today</div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Sections */}
      <div className="grid gap-6">
        {renderMealSection('breakfast', 'Breakfast', <Utensils className="h-5 w-5 text-orange-500" />)}
        {renderMealSection('lunch', 'Lunch', <Utensils className="h-5 w-5 text-yellow-500" />)}
        {renderMealSection('dinner', 'Dinner', <Utensils className="h-5 w-5 text-blue-500" />)}
        {renderMealSection('snacks', 'Snacks', <Utensils className="h-5 w-5 text-green-500" />)}
      </div>
    </div>
  );
};

export default FoodDiary;
