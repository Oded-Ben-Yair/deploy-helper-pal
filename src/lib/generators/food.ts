
export function generateFoodIdeas(theme: string, dietaryRestrictions: string, foodPreferences: string = ""): string[] {
  const themeFoods: Record<string, string[]> = {
    "Superhero": [
      "Hero sandwich bar",
      "Power-packed fruit skewers",
      "Superhero-decorated cupcakes",
      "Color-themed snacks",
    ],
    "Princess": [
      "Tea sandwiches",
      "Crown-shaped cookies",
      "Pink princess punch",
      "Jewel-toned fruit platter",
    ],
    "Sports": [
      "Stadium-style nachos and hot dogs",
      "Sports ball-shaped treats",
      "Energy snack mix",
      "Sports drink station",
    ],
    "Space": [
      "Planet-shaped cookies",
      "Star-shaped sandwiches",
      "Galaxy-colored popcorn",
      "Rocket fruit skewers",
    ],
    "Dinosaur": [
      "Dino nuggets",
      "Fossil cookies",
      "Prehistoric punch",
      "Veggie herbivore platter",
    ],
    "Gaming": [
      "Pixel-art fruit platter",
      "Power-up snack mix",
      "Game controller cookies",
      "Pizza power-ups",
    ],
    "Art": [
      "Colorful palette cookies",
      "Paint brush pretzel rods",
      "Rainbow fruit skewers",
      "Edible color mixing station",
    ],
    "Music": [
      "Musical note cookies",
      "Microphone-shaped cake pops",
      "Rockin' roll-up sandwiches",
      "Fruit drum kit display",
    ],
    "Animals": [
      "Animal cracker bar",
      "Animal-face cupcakes",
      "Jungle trail mix",
      "Safari veggie platter",
    ],
    "Ocean": [
      "Fish-shaped sandwiches",
      "Blue jello cups with gummy fish",
      "Seashell cookies",
      "Under-the-sea fruit display",
    ],
    "Magic": [
      "Magic wand pretzel rods",
      "Color-changing drinks",
      "Potion punch bowl",
      "Wizard hat cupcakes",
    ],
    "Science": [
      "Molecule cookies",
      "Test tube fruit cups",
      "Edible science experiments",
      "Element-labeled snacks",
    ],
  };
  
  let foodSuggestions = themeFoods[theme.toLowerCase()] || [
    "Birthday cake",
    "Assorted finger foods",
    "Fruit platter",
    "Chips and dip",
  ];
  
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    console.log("Adjusting for dietary restrictions:", dietaryRestrictions);
    if (dietaryRestrictions.toLowerCase().includes("vegetarian")) {
      foodSuggestions = foodSuggestions.map(food => 
        food.toLowerCase().includes("meat") ? "Vegetarian " + food : food
      );
    }
    if (dietaryRestrictions.toLowerCase().includes("vegan")) {
      foodSuggestions = foodSuggestions.map(food => 
        food.toLowerCase().includes("cheese") || food.toLowerCase().includes("cream") 
        ? "Vegan " + food : food
      );
    }
    if (dietaryRestrictions.toLowerCase().includes("gluten")) {
      foodSuggestions = foodSuggestions.map(food => 
        food.toLowerCase().includes("bread") || food.toLowerCase().includes("cookie") 
        ? "Gluten-free " + food : food
      );
    }
  }
  
  if (foodPreferences && foodPreferences.length > 0) {
    const preferences = foodPreferences.toLowerCase().split(',').map(p => p.trim());
    
    const customItems = preferences.map(pref => `Custom ${pref} dish`).slice(0, 2);
    
    foodSuggestions = [...customItems, ...foodSuggestions.slice(0, 3)];
  }
  
  return foodSuggestions;
}
