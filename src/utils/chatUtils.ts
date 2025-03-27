
import { generatePartyPlan } from "@/lib/ai";

export async function processUserMessage(input: string) {
  // Check if this looks like an event planning request
  const userInput = input.toLowerCase();
  
  if (userInput.includes("plan") || 
      userInput.includes("event") || 
      userInput.includes("party") || 
      userInput.includes("celebration") ||
      userInput.includes("organize") ||
      userInput.includes("arrange")) {
    
    // Extract information based on message content
    let eventType = "";
    let guestCount = "20";
    let budget = "500";
    let location = "venue";
    
    if (userInput.includes("birthday")) eventType = "birthday";
    else if (userInput.includes("wedding")) eventType = "wedding";
    else if (userInput.includes("corporate")) eventType = "corporate";
    else if (userInput.includes("baby shower")) eventType = "baby shower";
    else if (userInput.includes("anniversary")) eventType = "anniversary";
    else if (userInput.includes("graduation")) eventType = "graduation";
    else if (userInput.includes("retirement")) eventType = "retirement";
    
    // Extract guest count if mentioned
    const guestMatch = userInput.match(/(\d+)\s*(guests|people)/);
    if (guestMatch) guestCount = guestMatch[1];
    
    // Extract budget if mentioned
    const budgetMatch = userInput.match(/(\d+)\s*(dollars|euros|budget)/);
    if (budgetMatch) budget = budgetMatch[1];
    
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
    let aiResponse = `I've created an event plan based on a ${selectedTheme} theme! Here are some ideas:
    
Activities:
${result.plans[0].activities.map((a: string) => `• ${a}`).join('\n')}

Food Ideas:
${result.plans[0].foodIdeas.map((f: string) => `• ${f}`).join('\n')}

Drink Suggestions:
${result.plans[0].drinkIdeas ? result.plans[0].drinkIdeas.map((d: string) => `• ${d}`).join('\n') : "• Based on your preferences"}

Decoration Ideas:
${result.plans[0].decorations ? result.plans[0].decorations.map((d: string) => `• ${d}`).join('\n') : "• Themed decorations that match your event style"}

I've also designed a custom invitation for this event!`;

    // Generate appropriate follow-up question
    let followUpQuestion = "";
    if (!eventType) {
      followUpQuestion = "\n\nCould you tell me what type of event this is (birthday, wedding, corporate, etc.)?";
    } else if (!userInput.includes("theme") && !userInput.includes("style")) {
      followUpQuestion = "\n\nDo you have any specific theme or style preferences for this event?";
    } else {
      followUpQuestion = "\n\nWould you like to see the invitation I've designed, or would you like me to suggest any specific aspects of the event planning (venue, entertainment, etc.)?";
    }
    
    aiResponse += followUpQuestion;
    
    return {
      response: aiResponse,
      partyPlan: result
    };
  } else {
    // More detailed guidance if not an event planning request
    const aiResponse = `I'm your event planning assistant. To help you plan the perfect event, I need some key details:

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
    
    return {
      response: aiResponse,
      partyPlan: null
    };
  }
}
