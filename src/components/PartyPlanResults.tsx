
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationPreview } from "./InvitationPreview";

type PartyPlanResultsProps = {
  results: {
    plans: Array<{
      title: string;
      description: string;
      theme: string;
      activities: string[];
      foodIdeas: string[];
      decorations: string[];
      estimatedCost: string;
    }>;
    invitationText: string;
    budgetBreakdown: {
      food: number;
      decorations: number;
      activities: number;
      venue: number;
      misc: number;
    };
  };
};

export function PartyPlanResults({ results }: PartyPlanResultsProps) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [showInvitation, setShowInvitation] = useState(false);

  if (showInvitation) {
    return (
      <div className="space-y-6">
        <InvitationPreview 
          invitationText={results.invitationText} 
          theme={results.plans[selectedPlan].theme} 
        />
        <Button onClick={() => setShowInvitation(false)}>
          Back to Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Your AI-Generated Party Plans</h2>
        <p className="text-gray-600">
          Choose a plan that suits your needs or customize any of these suggestions
        </p>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Party Plans</TabsTrigger>
          <TabsTrigger value="budget">Budget Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {results.plans.map((plan, index) => (
              <Card key={index} className={`cursor-pointer transition-all ${selectedPlan === index ? 'border-purple-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedPlan(index)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-purple-800">{plan.title}</CardTitle>
                  <CardDescription>Theme: {plan.theme}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="mb-2">{plan.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Estimated Cost: {plan.estimatedCost}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(index);
                    setShowInvitation(true);
                  }}>
                    View Invitation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">Budget Breakdown</CardTitle>
              <CardDescription>Estimated costs for different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Food & Drinks</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.food}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Decorations</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.decorations}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Activities</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.activities}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.venue}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Miscellaneous</span>
                    <span className="font-semibold">${results.budgetBreakdown.misc}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">
                      ${Object.values(results.budgetBreakdown).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="pt-4">
        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
