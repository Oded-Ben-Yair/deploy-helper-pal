import React, { useState } from "react";
import { PartyPlanData, PartyPlan, BudgetBreakdown } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { generateInvitationImage } from "@/lib/ai";
import { saveAs } from 'file-saver';
import { Badge } from "@/components/ui/badge";
import { VenueDetails } from "@/components/VenueDetails";
import { BudgetOptimizer } from "@/components/BudgetOptimizer";

type PartyPlanResultsProps = {
  results: PartyPlanData;
};

export function PartyPlanResults({ results }: PartyPlanResultsProps) {
  const [invitationImage, setInvitationImage] = useState<string | null>(null);
  const [isVenueDetailsOpen, setIsVenueDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PartyPlan | null>(null);
  const [isBudgetOptimizerOpen, setIsBudgetOptimizerOpen] = useState(false);
  const [optimizedBudget, setOptimizedBudget] = useState<BudgetBreakdown>(results.budgetBreakdown);

  const showInvitationPreview = async () => {
    const image = await generateInvitationImage(results.invitationText);
    setInvitationImage(image);
  };

  const downloadPlan = () => {
    const planData = JSON.stringify(results, null, 2);
    const blob = new Blob([planData], { type: "text/json;charset=utf-8" });
    saveAs(blob, "party_plan.json");
  };

  const handleOpenVenueDetails = (plan: PartyPlan) => {
    setSelectedPlan(plan);
    setIsVenueDetailsOpen(true);
  };

  const handleCloseVenueDetails = () => {
    setIsVenueDetailsOpen(false);
    setSelectedPlan(null);
  };

  const handleBookVenue = (venue: any) => {
    alert(`Venue ${venue.name} booked successfully!`);
    handleCloseVenueDetails();
  };

  const handleOpenBudgetOptimizer = (plan: PartyPlan) => {
    setSelectedPlan(plan);
    setIsBudgetOptimizerOpen(true);
  };

  const handleCloseBudgetOptimizer = () => {
    setIsBudgetOptimizerOpen(false);
    setSelectedPlan(null);
  };

  const handleSaveOptimizedBudget = (newBudget: BudgetBreakdown) => {
    setOptimizedBudget(newBudget);
    setIsBudgetOptimizerOpen(false);
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Event Plan Results</h1>

      {results.plans.map((plan, index) => (
        <div key={index} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">{plan.title}</h2>
          <p className="text-gray-300 mb-4">{plan.description}</p>

          <div className="mb-4">
            <Badge className="mr-2 bg-blue-600 border-blue-700 text-white">Theme: {plan.theme}</Badge>
            <Badge className="mr-2 bg-green-600 border-green-700 text-white">Estimated Cost: {plan.estimatedCost}</Badge>
            <Badge className="bg-purple-600 border-purple-700 text-white">Location: {plan.location}</Badge>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-2">Activities</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            {plan.activities.map((activity, i) => (
              <li key={i}>{activity}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Food Ideas</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            {plan.foodIdeas.map((food, i) => (
              <li key={i}>{food}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Drink Ideas</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            {plan.drinkIdeas.map((drink, i) => (
              <li key={i}>{drink}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Decoration Ideas</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            {plan.decorations.map((decoration, i) => (
              <li key={i}>{decoration}</li>
            ))}
          </ul>

          <div className="flex justify-end gap-4 mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleOpenVenueDetails(plan)}>
              View Venue Options
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700" onClick={() => handleOpenBudgetOptimizer(plan)}>
              Optimize Budget
            </Button>
          </div>
        </div>
      ))}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Invitation Text</h2>
      <div className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <p className="text-gray-300 whitespace-pre-line">{results.invitationText}</p>
        <div className="flex justify-end gap-4 mt-4">
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={showInvitationPreview}>
            Show Invitation Preview
          </Button>
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700" onClick={downloadPlan}>
            Download Plan
          </Button>
        </div>
      </div>

      {invitationImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setInvitationImage(null)}>
          <img src={invitationImage} alt="Invitation Preview" className="max-w-4xl max-h-screen" />
        </div>
      )}

      {selectedPlan && isVenueDetailsOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <VenueDetails plan={selectedPlan} onClose={handleCloseVenueDetails} onBook={handleBookVenue} />
        </div>
      )}

      {selectedPlan && isBudgetOptimizerOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <BudgetOptimizer
            plan={selectedPlan}
            initialBudget={results.budgetBreakdown}
            onSave={handleSaveOptimizedBudget}
            onClose={handleCloseBudgetOptimizer}
          />
        </div>
      )}
    </div>
  );
}
