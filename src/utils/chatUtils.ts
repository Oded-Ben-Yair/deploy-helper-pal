
/**
 * Chat interaction utilities
 * Processes user messages and generates AI responses for event planning
 */

import { generatePartyPlan } from "@/lib/ai";
import { PartyPlanData } from "@/types/chat";

/**
 * Process a user message to detect event planning requests and generate appropriate responses
 * @param input User input text
 * @returns Generated response and party plan data (if applicable)
 */
export async function processUserMessage(input: string): Promise<{
  response: string;
  partyPlan: PartyPlanData | null;
}> {
  // Check if this looks like an event planning request
  const userInput = input.toLowerCase();
  
  const planningTerms = ["plan", "event", "party", "celebration", "organize", "arrange"];
  const isEventRequest = planningTerms.some(term => userInput.includes(term));
  
  if (isEventRequest) {
    // Extract event information from the message
    let eventType = extractEventType(userInput);
    let guestCount = extractGuestCount(userInput);
    let budget = extractBudget(userInput);
    let location = "venue";
    
    // Create event data object for AI planning
    const eventData = {
      name: eventType || "Event",
      hostName: "",
      guests: guestCount,
      budget: budget,
      interests: input,
      location: location,
      guestType: userInput.includes("kid") || userInput.includes("child") ? "children" : "adults",
      date: new Date(),
      additionalDetails: input,
      city: "",
      country: "",
      currency: "USD",
      dietaryRestrictions: "",
      eventType: eventType || "Event",
      foodPreferences: "",
      drinkPreferences: "",
      preferences: ""
    };
    
    const result = await generatePartyPlan(eventData);
    const selectedTheme = result.plans[0].theme;
    
    // Generate personalized response based on extracted information
    let aiResponse = formatPartyPlanResponse(result, selectedTheme);
    
    // Generate appropriate follow-up question
    let followUpQuestion = generateFollowUpQuestion(eventType, userInput);
    aiResponse += followUpQuestion;
    
    return {
      response: aiResponse,
      partyPlan: result
    };
  } else {
    // Return guidance if not an event planning request
    return {
      response: getGuidanceResponse(),
      partyPlan: null
    };
  }
}

/**
 * Extract event type from user message
 * @param userInput Lowercase user message
 * @returns Detected event type or empty string
 */
function extractEventType(userInput: string): string {
  const eventTypes = [
    "birthday", "wedding", "corporate", "baby shower", 
    "anniversary", "graduation", "retirement"
  ];
  
  for (const type of eventTypes) {
    if (userInput.includes(type)) {
      return type;
    }
  }
  
  return "";
}

/**
 * Extract guest count from user message
 * @param userInput Lowercase user message
 * @returns Extracted guest count as string
 */
function extractGuestCount(userInput: string): string {
  const guestMatch = userInput.match(/(\d+)\s*(guests|people)/);
  return guestMatch ? guestMatch[1] : "20";
}

/**
 * Extract budget from user message
 * @param userInput Lowercase user message
 * @returns Extracted budget as string
 */
function extractBudget(userInput: string): string {
  const budgetMatch = userInput.match(/(\d+)\s*(dollars|euros|budget)/);
  return budgetMatch ? budgetMatch[1] : "500";
}

/**
 * Format the AI response based on generated party plan
 * @param result Party plan data
 * @param selectedTheme Selected theme
 * @returns Formatted response string
 */
function formatPartyPlanResponse(result: PartyPlanData, selectedTheme: string): string {
  return `I've created an event plan based on a ${selectedTheme} theme! Here are some ideas:
    
Activities:
${result.plans[0].activities.map((a: string) => `• ${a}`).join('\n')}

Food Ideas:
${result.plans[0].foodIdeas.map((f: string) => `• ${f}`).join('\n')}

Drink Suggestions:
${result.plans[0].drinkIdeas ? result.plans[0].drinkIdeas.map((d: string) => `• ${d}`).join('\n') : "• Based on your preferences"}

Decoration Ideas:
${result.plans[0].decorations ? result.plans[0].decorations.map((d: string) => `• ${d}`).join('\n') : "• Themed decorations that match your event style"}

I've also designed a custom invitation for this event!`;
}

/**
 * Generate a follow-up question based on user input
 * @param eventType Detected event type
 * @param userInput Original user message
 * @returns Follow-up question
 */
function generateFollowUpQuestion(eventType: string, userInput: string): string {
  if (!eventType) {
    return "\n\nCould you tell me what type of event this is (birthday, wedding, corporate, etc.)?";
  } else if (!userInput.includes("theme") && !userInput.includes("style")) {
    return "\n\nDo you have any specific theme or style preferences for this event?";
  } else {
    return "\n\nWould you like to see the invitation I've designed, or would you like me to suggest any specific aspects of the event planning (venue, entertainment, etc.)?";
  }
}

/**
 * Get guidance response for non-event planning messages
 * @returns Guidance response string
 */
function getGuidanceResponse(): string {
  return `I'm your event planning assistant. To help you plan the perfect event, I need some key details:

• Event type (birthday, wedding, anniversary, corporate, etc.)
• Host information (who's organizing or who it's for)
• Date, time, and duration of the event
• Approximate number of guests and guest demographics
• Budget range and preferred currency
• Location (city, country, venue preferences)
• Theme ideas or special interests
• Food and drink preferences
• Any dietary restrictions
• Dress code expectations
• Transportation needs
• Entertainment preferences
• Special requirements (accessibility, photography, etc.)

The more details you provide, the better I can tailor my suggestions!`;
}
