
/**
 * Drink suggestion generator for party planning
 * Generates drink ideas based on theme, guest type, and preferences
 */

/**
 * Generates drink suggestions based on party theme and guest type
 * @param theme Party theme (e.g., superhero, princess)
 * @param isKid Whether the party is for children
 * @param drinkPreferences User's specified drink preferences
 * @returns Array of drink suggestions
 */
export function generateDrinkIdeas(theme: string, isKid: boolean, drinkPreferences: string = ""): string[] {
  // Default drink options for kids
  const kidDrinks = [
    "Fruit punch",
    "Themed color juice boxes",
    "Chocolate milk",
    "Flavored water station",
    "Smoothies"
  ];
  
  // Default drink options for adults
  const adultDrinks = [
    "Signature cocktail",
    "Wine selection",
    "Craft beer bar",
    "Champagne toast",
    "Classic cocktails"
  ];
  
  // Theme-specific drink suggestions
  const themeDrinks: Record<string, string[]> = {
    "superhero": isKid ? 
      ["Power punch", "Super strength smoothies", "Colorful hero juices"] : 
      ["Hero-themed cocktails", "Power potions", "Colorful mixed drinks"],
    
    "princess": isKid ? 
      ["Royal tea", "Pink lemonade", "Fairy sparkle juice"] :
      ["Princess cocktails", "Pink champagne", "Royal tea with liqueur"],
    
    "space": isKid ? 
      ["Rocket fuel punch", "Galaxy lemonade", "Star sparkle water"] :
      ["Cosmic cocktails", "Moon martinis", "Starlight sparklers"],
    
    "party": isKid ? 
      ["Party punch", "Rainbow sodas", "Fizzy fruit drinks"] :
      ["Party punch (with optional spirits)", "Specialty cocktails", "Champagne bar"]
  };
  
  // Select appropriate drink suggestions based on theme
  let drinkSuggestions = themeDrinks[theme.toLowerCase()] || (isKid ? kidDrinks : adultDrinks);
  
  // Incorporate user preferences if provided
  if (drinkPreferences && drinkPreferences.length > 0) {
    const preferences = drinkPreferences.toLowerCase().split(',').map(p => p.trim());
    const customItems = preferences.map(pref => `Custom ${pref} drink`).slice(0, 2);
    drinkSuggestions = [...customItems, ...drinkSuggestions.slice(0, 3)];
  }
  
  return drinkSuggestions;
}
