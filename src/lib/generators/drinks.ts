
export function generateDrinkIdeas(theme: string, isKid: boolean, drinkPreferences: string = ""): string[] {
  const kidDrinks = [
    "Fruit punch",
    "Themed color juice boxes",
    "Chocolate milk",
    "Flavored water station",
    "Smoothies"
  ];
  
  const adultDrinks = [
    "Signature cocktail",
    "Wine selection",
    "Craft beer bar",
    "Champagne toast",
    "Classic cocktails"
  ];
  
  const themeDrinks: Record<string, string[]> = {
    "superhero": isKid ? ["Power punch", "Super strength smoothies", "Colorful hero juices"] : 
                         ["Hero-themed cocktails", "Power potions", "Colorful mixed drinks"],
    "princess": isKid ? ["Royal tea", "Pink lemonade", "Fairy sparkle juice"] :
                        ["Princess cocktails", "Pink champagne", "Royal tea with liqueur"],
    "space": isKid ? ["Rocket fuel punch", "Galaxy lemonade", "Star sparkle water"] :
                     ["Cosmic cocktails", "Moon martinis", "Starlight sparklers"],
    "party": isKid ? ["Party punch", "Rainbow sodas", "Fizzy fruit drinks"] :
                      ["Party punch (with optional spirits)", "Specialty cocktails", "Champagne bar"]
  };
  
  let drinkSuggestions = themeDrinks[theme.toLowerCase()] || (isKid ? kidDrinks : adultDrinks);
  
  if (drinkPreferences && drinkPreferences.length > 0) {
    const preferences = drinkPreferences.toLowerCase().split(',').map(p => p.trim());
    
    const customItems = preferences.map(pref => `Custom ${pref} drink`).slice(0, 2);
    
    drinkSuggestions = [...customItems, ...drinkSuggestions.slice(0, 3)];
  }
  
  return drinkSuggestions;
}
