
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Utensils } from 'lucide-react';

const FoodDiary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [meals, setMeals] = useState({
    breakfast: [
      { name: 'Oatmeal with Berries', calories: 280, serving: '1 cup' },
      { name: 'Greek Yogurt', calories: 140, serving: '1 container' }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 350, serving: '1 large bowl' },
      { name: 'Whole Wheat Bread', calories: 80, serving: '1 slice' }
    ],
    dinner: [
      { name: 'Salmon Fillet', calories: 280, serving: '6 oz' },
      { name: 'Steamed Broccoli', calories: 60, serving: '1 cup' }
    ],
    snacks: [
      { name: 'Apple', calories: 80, serving: '1 medium' },
      { name: 'Almonds', calories: 160, serving: '1 oz' }
    ]
  });

  const foodDatabase = [
    { name: 'Banana', calories: 105, serving: '1 medium' },
    { name: 'Chicken Breast', calories: 165, serving: '3.5 oz' },
    { name: 'Brown Rice', calories: 112, serving: '1/2 cup cooked' },
    { name: 'Avocado', calories: 234, serving: '1 whole' },
    { name: 'Eggs', calories: 70, serving: '1 large' },
    { name: 'Sweet Potato', calories: 112, serving: '1 medium' },
    { name: 'Spinach', calories: 7, serving: '1 cup' },
    { name: 'Quinoa', calories: 111, serving: '1/2 cup cooked' }
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFoodToMeal = (food, mealType) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], food]
    }));
  };

  const getTotalCalories = (mealType) => {
    return meals[mealType].reduce((total, food) => total + food.calories, 0);
  };

  const getTotalDayCalories = () => {
    return Object.values(meals).flat().reduce((total, food) => total + food.calories, 0);
  };

  const renderMealSection = (mealType, title, icon) => (
    <Card key={mealType} className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
          <Badge variant="secondary">{getTotalCalories(mealType)} cal</Badge>
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setSelectedMeal(mealType)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Food to {title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredFoods.map((food, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => addFoodToMeal(food, mealType)}
                  >
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">{food.serving}</div>
                    </div>
                    <Badge>{food.calories} cal</Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {meals[mealType].map((food, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-muted-foreground">{food.serving}</div>
              </div>
              <Badge variant="outline">{food.calories} cal</Badge>
            </div>
          ))}
          {meals[mealType].length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No foods logged yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Food Diary</h2>
        <p className="text-muted-foreground">Track your daily nutrition</p>
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
