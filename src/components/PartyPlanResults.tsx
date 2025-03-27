
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationPreview } from "./InvitationPreview";
import { MapPin, Calendar, Users, DollarSign, Utensils, Wine, Gift } from "lucide-react";

type PartyPlanResultsProps = {
  results: {
    plans: Array<{
      title: string;
      description: string;
      theme: string;
      activities: string[];
      foodIdeas: string[];
      drinkIdeas: string[];
      decorations: string[];
      venues: string[];
      estimatedCost: string;
      hostName: string;
      location: string;
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
  const [activeTab, setActiveTab] = useState("plans");

  if (showInvitation) {
    return (
      <div className="space-y-6">
        <InvitationPreview 
          invitationText={results.invitationText} 
          theme={results.plans[selectedPlan].theme} 
        />
        <Button onClick={() => setShowInvitation(false)} className="w-full bg-blue-600 hover:bg-blue-700">
          Back to Plans
        </Button>
      </div>
    );
  }

  const currentPlan = results.plans[selectedPlan];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Your AI-Generated Party Plans</h2>
        <p className="text-gray-400">
          Choose a plan that suits your needs or customize any of these suggestions
        </p>
      </div>

      <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="plans" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Party Plans</TabsTrigger>
          <TabsTrigger value="details" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Plan Details</TabsTrigger>
          <TabsTrigger value="budget" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {results.plans.map((plan, index) => (
              <Card key={index} 
                className={`cursor-pointer transition-all bg-gray-800 border-gray-700 hover:bg-gray-700 ${
                  selectedPlan === index ? 'border-blue-500 shadow-md' : 'border-gray-700'
                }`}
                onClick={() => setSelectedPlan(index)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">{plan.title}</CardTitle>
                  <CardDescription className="text-gray-400">Theme: {plan.theme}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 text-gray-300">
                  <p className="mb-2">{plan.description}</p>
                  <div className="flex items-center text-sm mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{plan.location}</span>
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{plan.estimatedCost}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-600 text-white hover:bg-gray-700" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(index);
                      setActiveTab("details");
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">{currentPlan.title}</CardTitle>
              <CardDescription className="text-gray-400">Hosted by: {currentPlan.hostName}</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div className="space-y-4">
                <p>{currentPlan.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <section>
                    <h3 className="flex items-center text-white font-semibold mb-2">
                      <Gift className="h-4 w-4 mr-2 text-blue-400" />
                      Activities
                    </h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-1">
                      {currentPlan.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="flex items-center text-white font-semibold mb-2">
                      <Utensils className="h-4 w-4 mr-2 text-blue-400" />
                      Food Ideas
                    </h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-1">
                      {currentPlan.foodIdeas.map((food, index) => (
                        <li key={index}>{food}</li>
                      ))}
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="flex items-center text-white font-semibold mb-2">
                      <Wine className="h-4 w-4 mr-2 text-blue-400" />
                      Drink Ideas
                    </h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-1">
                      {currentPlan.drinkIdeas.map((drink, index) => (
                        <li key={index}>{drink}</li>
                      ))}
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="flex items-center text-white font-semibold mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                      Venue Ideas
                    </h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-1">
                      {currentPlan.venues.map((venue, index) => (
                        <li key={index}>{venue}</li>
                      ))}
                    </ul>
                  </section>
                  
                  <section className="md:col-span-2">
                    <h3 className="flex items-center text-white font-semibold mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                      Decorations
                    </h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-1">
                      {currentPlan.decorations.map((decoration, index) => (
                        <li key={index}>{decoration}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowInvitation(true)}
              >
                Preview Invitation
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("plans")}
                className="w-full border-gray-600 text-white hover:bg-gray-700"
              >
                Back to Plans
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Budget Breakdown</CardTitle>
              <CardDescription className="text-gray-400">Estimated costs for different categories</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Food & Drinks</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.food}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Decorations</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.decorations}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Activities</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.activities}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Venue</p>
                    <p className="text-2xl font-semibold">${results.budgetBreakdown.venue}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
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
        <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700" onClick={() => window.location.reload()}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
