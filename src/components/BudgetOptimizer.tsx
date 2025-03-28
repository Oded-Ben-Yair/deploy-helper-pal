
import React, { useState } from "react";
import { PartyPlan, BudgetBreakdown } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type BudgetOptimizerProps = {
  plan: PartyPlan;
  initialBudget: BudgetBreakdown;
  onSave: (optimizedBudget: BudgetBreakdown) => void;
  onClose: () => void;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

export function BudgetOptimizer({ plan, initialBudget, onSave, onClose }: BudgetOptimizerProps) {
  const [budget, setBudget] = useState<BudgetBreakdown>({ ...initialBudget });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const totalBudget = Object.values(budget).reduce((sum, value) => sum + value, 0);
  
  const handleSliderChange = (category: keyof BudgetBreakdown, value: number[]) => {
    const newBudget = { ...budget, [category]: value[0] };
    setBudget(newBudget);
    
    // Generate suggestions based on budget changes
    const newSuggestions: string[] = [];
    
    if (newBudget.food < initialBudget.food * 0.7) {
      newSuggestions.push("Consider potluck-style food options or simpler menu items to reduce food costs.");
    }
    
    if (newBudget.venue < initialBudget.venue * 0.7) {
      newSuggestions.push("Look for free or low-cost venue options like public parks or hosting at home.");
    }
    
    if (newBudget.decorations < initialBudget.decorations * 0.6) {
      newSuggestions.push("Use DIY decorations or reusable items to cut decoration costs.");
    }
    
    setSuggestions(newSuggestions);
  };
  
  const chartData = [
    { name: 'Food', value: budget.food },
    { name: 'Venue', value: budget.venue },
    { name: 'Activities', value: budget.activities },
    { name: 'Decorations', value: budget.decorations },
    { name: 'Miscellaneous', value: budget.misc }
  ];
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Budget Optimizer for {plan.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Adjust Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Food & Beverages</Label>
                    <span className="text-white">{plan.estimatedCost.split(' ')[0]} {budget.food}</span>
                  </div>
                  <Slider 
                    value={[budget.food]} 
                    max={Math.round(totalBudget * 0.7)} 
                    step={10}
                    onValueChange={(value) => handleSliderChange('food', value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Venue</Label>
                    <span className="text-white">{plan.estimatedCost.split(' ')[0]} {budget.venue}</span>
                  </div>
                  <Slider 
                    value={[budget.venue]} 
                    max={Math.round(totalBudget * 0.6)} 
                    step={10}
                    onValueChange={(value) => handleSliderChange('venue', value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Activities & Entertainment</Label>
                    <span className="text-white">{plan.estimatedCost.split(' ')[0]} {budget.activities}</span>
                  </div>
                  <Slider 
                    value={[budget.activities]} 
                    max={Math.round(totalBudget * 0.5)} 
                    step={10}
                    onValueChange={(value) => handleSliderChange('activities', value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Decorations</Label>
                    <span className="text-white">{plan.estimatedCost.split(' ')[0]} {budget.decorations}</span>
                  </div>
                  <Slider 
                    value={[budget.decorations]} 
                    max={Math.round(totalBudget * 0.4)} 
                    step={10}
                    onValueChange={(value) => handleSliderChange('decorations', value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Miscellaneous</Label>
                    <span className="text-white">{plan.estimatedCost.split(' ')[0]} {budget.misc}</span>
                  </div>
                  <Slider 
                    value={[budget.misc]} 
                    max={Math.round(totalBudget * 0.3)} 
                    step={10}
                    onValueChange={(value) => handleSliderChange('misc', value)} 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-white">Cost-Saving Suggestions</h3>
                {suggestions.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Adjust the sliders to see budget optimization suggestions.</p>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-700 flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-white hover:bg-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => onSave(budget)}
                >
                  Save Budget Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="text-white">Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${plan.estimatedCost.split(' ')[0]} ${value}`, 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-white font-semibold">Total Budget: {plan.estimatedCost}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Adjust the sliders to reallocate your budget while keeping the total the same.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
