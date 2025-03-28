
/**
 * AI Party Planning Module
 * This module provides functions for generating party planning suggestions and materials.
 */

import { toast } from "@/hooks/use-toast";
import { 
  generateActivities,
  generateFoodIdeas,
  generateDrinkIdeas,
  generateDecorations,
  generateVenueSuggestions,
  generateInvitationText,
  generateInvitationImage as generateImageFromTheme
} from "@/lib/generators";

/**
 * Generates a comprehensive party plan based on user inputs
 * @param formData User input data containing event details
 * @returns A structured party plan with themes, activities, food ideas, etc.
 */
export async function generatePartyPlan(formData: any) {
  console.log("Generating party plan with data:", formData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Define possible themes for event selection
  const possibleThemes = [
    "Superhero", "Princess", "Sports", "Space", "Dinosaur", 
    "Gaming", "Art", "Music", "Animals", "Ocean", "Magic", "Science",
    "Wedding", "Corporate", "Graduation", "Party", "Formal", "Casual"
  ];
  
  // Select themes based on interests
  const interests = formData.interests?.toLowerCase() || '';
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
  const totalBudget = parseInt(formData.budget) || 500;
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
    const age = formData.age ? parseInt(formData.age) : null;
    
    // Generate activities based on guest type, theme, and age
    const activities = generateActivities(theme, isKid, age);
    
    // Generate food ideas based on theme and dietary restrictions
    const foodIdeas = generateFoodIdeas(theme, formData.dietaryRestrictions || '', formData.foodPreferences || '');
    
    // Generate drink ideas based on preferences
    const drinkIdeas = generateDrinkIdeas(theme, isKid, formData.drinkPreferences || '');
    
    // Generate decorations based on theme
    const decorations = generateDecorations(theme);
    
    // Generate venue suggestions based on location type
    const venues = generateVenueSuggestions(theme, formData.location || 'venue', formData.city || 'Local', age);
    
    return {
      title: `${theme} ${formData.eventType || 'Event'} Experience`,
      description: `A fun-filled ${theme.toLowerCase()} themed ${(formData.eventType || 'event').toLowerCase()} perfect for ${formData.name || 'you'}, with activities and decorations that will create amazing memories.`,
      theme,
      activities,
      foodIdeas,
      drinkIdeas,
      decorations,
      venues,
      estimatedCost: `${formData.currency || 'USD'} ${totalBudget}`,
      hostName: formData.hostName || 'Host',
      location: `${formData.city || 'City'}, ${formData.country || 'Country'}`,
      age: age
    };
  });
  
  // Generate invitation text
  const selectedTheme = plans[0].theme;
  const invitationText = generateInvitationText(
    formData.name || 'Guest', 
    formData.hostName || 'Host',
    formData.eventType || 'Event',
    selectedTheme,
    formData.date ? new Date(formData.date) : new Date()
  );
  
  return {
    plans,
    invitationText,
    budgetBreakdown,
  };
}

/**
 * Generates an invitation image based on theme
 * @param theme The selected party theme
 * @param invitationText Text to display on the invitation
 * @returns URL to the generated image
 */
export function generateInvitationImage(theme: string, invitationText: string): Promise<string> {
  return generateImageFromTheme(theme, invitationText);
}
