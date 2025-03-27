
import { toast } from "@/hooks/use-toast";
import { 
  generateActivities,
  generateFoodIdeas,
  generateDrinkIdeas,
  generateDecorations,
  generateVenueSuggestions,
  generateInvitationText,
  generateInvitationImage
} from "@/lib/generators";

// We're using a mock implementation until you provide the real API key and decide whether to use a server-side approach
export async function generatePartyPlan(formData: any) {
  console.log("Generating party plan with data:", formData);
  
  // In a real implementation, we would call the OpenAI API here
  // For now, we'll return mock data
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Example themes based on interests and age
  const possibleThemes = [
    "Superhero", "Princess", "Sports", "Space", "Dinosaur", 
    "Gaming", "Art", "Music", "Animals", "Ocean", "Magic", "Science",
    "Wedding", "Corporate", "Graduation", "Party", "Formal", "Casual"
  ];
  
  // Select themes based on interests
  const interests = formData.interests.toLowerCase();
  let relevantThemes = possibleThemes.filter(theme => 
    interests.includes(theme.toLowerCase())
  );
  
  // If no direct matches, select random themes
  if (relevantThemes.length === 0) {
    relevantThemes = [...possibleThemes].sort(() => 0.5 - Math.random()).slice(0, 3);
  } else if (relevantThemes.length > 3) {
    relevantThemes = relevantThemes.slice(0, 3);
  }
  
  // Calculate budget breakdown
  const totalBudget = parseInt(formData.budget);
  const budgetBreakdown = {
    food: Math.round(totalBudget * 0.4),
    decorations: Math.round(totalBudget * 0.15),
    activities: Math.round(totalBudget * 0.2),
    venue: Math.round(totalBudget * 0.15),
    misc: Math.round(totalBudget * 0.1),
  };
  
  // Generate party plans
  const plans = relevantThemes.map((theme) => {
    const guestType = formData.guestType || "adults";
    const isKid = guestType === "children" || guestType === "family";
    
    // Generate activities based on guest type and theme
    const activities = generateActivities(theme, isKid);
    
    // Generate food ideas based on theme and dietary restrictions
    const foodIdeas = generateFoodIdeas(theme, formData.dietaryRestrictions, formData.foodPreferences);
    
    // Generate drink ideas based on preferences
    const drinkIdeas = generateDrinkIdeas(theme, isKid, formData.drinkPreferences);
    
    // Generate decorations based on theme
    const decorations = generateDecorations(theme);
    
    // Generate venue suggestions based on location type
    const venues = generateVenueSuggestions(theme, formData.location, formData.city);
    
    return {
      title: `${theme} ${formData.eventType} Experience`,
      description: `A fun-filled ${theme.toLowerCase()} themed ${formData.eventType.toLowerCase()} perfect for ${formData.name}, with activities and decorations that will create amazing memories.`,
      theme,
      activities,
      foodIdeas,
      drinkIdeas,
      decorations,
      venues,
      estimatedCost: `${formData.currency} ${totalBudget}`,
      hostName: formData.hostName,
      location: `${formData.city}, ${formData.country}`,
    };
  });
  
  // Generate invitation text
  const selectedTheme = plans[0].theme;
  const invitationText = generateInvitationText(
    formData.name, 
    formData.hostName,
    formData.eventType,
    selectedTheme,
    formData.date ? new Date(formData.date) : new Date()
  );
  
  return {
    plans,
    invitationText,
    budgetBreakdown,
  };
}

// Re-export the image generator from our generators
export { generateInvitationImage };
