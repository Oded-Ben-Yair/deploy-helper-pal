
export type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export type PartyPlanData = {
  plans: PartyPlan[];
  invitationText: string;
  budgetBreakdown: BudgetBreakdown;
};

export type PartyPlan = {
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
  age?: number;
};

export type BudgetBreakdown = {
  food: number;
  decorations: number;
  activities: number;
  venue: number;
  misc: number;
};

export type VenueDetails = {
  name: string;
  address: string;
  price: number;
  capacity: number;
  amenities: string[];
  contactInfo: string;
  availability: boolean;
};
