import { toast } from "@/hooks/use-toast";

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

// New function to generate invitation images with DALL-E (mock for now)
export async function generateInvitationImage(theme: string, invitationText: string): Promise<string> {
  console.log("Generating invitation image for theme:", theme);
  
  // In a real implementation, we would call the OpenAI DALL-E API here
  // For now, we'll simulate a delay and return placeholder images
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock image URLs for different themes
  const themeImages: Record<string, string> = {
    "superhero": "https://img.freepik.com/free-vector/hand-drawn-flat-design-superhero-background_23-2149379088.jpg",
    "princess": "https://img.freepik.com/free-vector/hand-drawn-princess-background_23-2149707771.jpg",
    "sports": "https://img.freepik.com/free-vector/gradient-football-background_23-2149988782.jpg",
    "space": "https://img.freepik.com/free-vector/flat-design-galaxy-background_23-2149125624.jpg",
    "dinosaur": "https://img.freepik.com/free-vector/hand-drawn-dinosaur-background_23-2149363716.jpg",
    "gaming": "https://img.freepik.com/premium-vector/video-games-neon-background-with-colorful-controllers_23-2148238004.jpg",
    "art": "https://img.freepik.com/free-vector/watercolor-stains-abstract-background_23-2149107181.jpg",
    "music": "https://img.freepik.com/free-vector/colorful-music-background-flat-design_23-2147638584.jpg",
    "animals": "https://img.freepik.com/free-vector/cute-animals-pattern-background-design_53876-115388.jpg",
    "ocean": "https://img.freepik.com/free-vector/watercolor-abstract-blue-wave-background_23-2149098113.jpg",
    "magic": "https://img.freepik.com/free-vector/gradient-galaxy-background_23-2149388138.jpg",
    "science": "https://img.freepik.com/free-vector/realistic-science-background-with-molecules_23-2147844998.jpg",
    "wedding": "https://img.freepik.com/free-vector/hand-drawn-wedding-background_23-2149650188.jpg",
    "party": "https://img.freepik.com/free-vector/flat-design-birthday-background_23-2149046793.jpg",
  };
  
  return themeImages[theme.toLowerCase()] || "https://img.freepik.com/free-vector/flat-design-birthday-background_23-2149046793.jpg";
}

function generateVenueSuggestions(theme: string, locationType: string, city: string): string[] {
  const locationSuggestions: Record<string, Record<string, string[]>> = {
    "home": {
      "default": [
        "Living room transformed with themed decorations",
        "Backyard with canopy and lighting",
        "Garage converted to themed space",
        "Basement entertainment area"
      ]
    },
    "outdoors": {
      "default": [
        `Local park in ${city}`,
        "Public beach area with permit",
        "Botanical gardens",
        "Community sports field"
      ]
    },
    "venue": {
      "party": [
        `${city} Party Hall`,
        "Local community center",
        "Hotel event space",
        "Restaurant private room"
      ],
      "wedding": [
        "Elegant hotel ballroom",
        "Historic mansion",
        "Scenic vineyard",
        "Boutique event space"
      ],
      "corporate": [
        "Conference center",
        "Hotel meeting rooms",
        "Co-working space event area",
        "Business center"
      ]
    },
    "restaurant": {
      "default": [
        "Trendy restaurant with private dining",
        "Sports bar with event space",
        "Family-friendly restaurant",
        "Themed restaurant matching event"
      ]
    }
  };
  
  const themeMatch = locationSuggestions[locationType][theme.toLowerCase()] || 
                      locationSuggestions[locationType]["default"];
  
  return themeMatch || [
    `Venue in ${city}`,
    "Local event space",
    "Community center",
    "Hotel event room"
  ];
}

function generateActivities(theme: string, isKid: boolean) {
  const themeActivities: Record<string, string[]> = {
    "Superhero": [
      "Superhero costume contest",
      "Superhero training obstacle course",
      "Create your own superhero identity cards",
      "Superhero movie marathon",
    ],
    "Princess": [
      "Royal makeover station",
      "Decorate tiaras and crowns",
      "Royal tea party",
      "Princess dance competition",
    ],
    "Sports": [
      "Mini tournament of favorite sport",
      "Sports-themed relay races",
      "Medal ceremony for winners",
      "Sports trivia game",
    ],
    "Space": [
      "Build and launch mini rockets",
      "Create alien crafts",
      "Space-themed scavenger hunt",
      "Glow-in-the-dark games",
    ],
    "Dinosaur": [
      "Dinosaur egg hunt",
      "Dino fossil excavation",
      "Create dinosaur crafts",
      "Dinosaur-themed games",
    ],
    "Gaming": [
      "Video game tournament",
      "Create a real-life version of a video game",
      "Gaming trivia contest",
      "Board game competition",
    ],
    "Art": [
      "Paint and sip (juice for kids)",
      "Collaborative mural creation",
      "Art contest with prizes",
      "Craft stations with different art styles",
    ],
    "Music": [
      "Karaoke contest",
      "Musical chairs",
      "Create a birthday song",
      "Dance competition",
    ],
    "Animals": [
      "Animal face painting",
      "Create animal masks",
      "Animal-themed games",
      "Mini petting zoo (if budget allows)",
    ],
    "Ocean": [
      "Underwater treasure hunt",
      "Create ocean crafts",
      "Water balloon games",
      "Mermaid/pirate makeovers",
    ],
    "Magic": [
      "Magic show (professional or DIY)",
      "Learn simple magic tricks",
      "Potion making (mixed drinks)",
      "Magic-themed scavenger hunt",
    ],
    "Science": [
      "Fun science experiments",
      "Create slime or other compounds",
      "Science trivia game",
      "Build and test simple machines",
    ],
  };
  
  return themeActivities[theme] || [
    "Birthday cake and presents",
    "Musical chairs",
    "Scavenger hunt",
    "Dance party",
  ];
}

function generateFoodIdeas(theme: string, dietaryRestrictions: string, foodPreferences: string = "") {
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

function generateDrinkIdeas(theme: string, isKid: boolean, drinkPreferences: string = ""): string[] {
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

function generateDecorations(theme: string) {
  const themeDecorations: Record<string, string[]> = {
    "Superhero": [
      "Superhero emblems and logos",
      "City skyline backdrop",
      "Comic book style decorations",
      "Hero photo booth props",
    ],
    "Princess": [
      "Castle backdrop",
      "Tiaras and wands as favors",
      "Royal throne photo area",
      "Pink and gold decorations",
    ],
    "Sports": [
      "Team banners and pennants",
      "Sports equipment displays",
      "Trophy centerpieces",
      "Field/court floor runners",
    ],
    "Space": [
      "Glow-in-the-dark stars",
      "Planet hanging decorations",
      "Rocket ship centerpieces",
      "Astronaut photo booth",
    ],
    "Dinosaur": [
      "Dinosaur figurines",
      "Prehistoric plant decorations",
      "Fossil dig area",
      "Dinosaur footprint floor stickers",
    ],
    "Gaming": [
      "Gaming controller balloons",
      "Pixel art decorations",
      "Game character cutouts",
      "Level-up banners",
    ],
    "Art": [
      "Paint splatter decorations",
      "Artist palette centerpieces",
      "Gallery wall for kids' creations",
      "Colorful easel displays",
    ],
    "Music": [
      "Musical note balloons",
      "Instrument centerpieces",
      "Record and CD decorations",
      "VIP area with red carpet",
    ],
    "Animals": [
      "Animal print balloons",
      "Jungle vine decorations",
      "Animal cutouts",
      "Paw print floor stickers",
    ],
    "Ocean": [
      "Blue streamers as waves",
      "Seashell and starfish decorations",
      "Fish and bubble hanging ornaments",
      "Beach backdrop for photos",
    ],
    "Magic": [
      "Magic wand party favors",
      "Floating candle effect (battery operated)",
      "Mystical fog effect (dry ice)",
      "Spell book decorations",
    ],
    "Science": [
      "Beaker and test tube centerpieces",
      "Atom and molecule decorations",
      "Lab coat dress-up area",
      "Periodic table elements as decorations",
    ],
  };
  
  return themeDecorations[theme] || [
    "Balloons and streamers",
    "Birthday banner",
    "Table centerpieces",
    "Party hats and favors",
  ];
}

function generateInvitationText(eventName: string, hostName: string, eventType: string, theme: string, date: Date) {
  const dateString = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  const invitations: Record<string, string> = {
    "Superhero": `CALLING ALL SUPERHEROES!

Your presence is requested for a SUPER ${eventType}!
${eventName}

Join us for epic adventures, heroic games, and super treats.
Don't forget your superhero costume!

DATE: ${dateString}
TIME: ${timeString}
LOCATION: [Insert Location]

RSVP to ${hostName} by [Insert RSVP Date]

With great power comes great ${eventType.toLowerCase()} parties!`,

    "Princess": `🌟 ROYAL INVITATION 🌟

By royal decree, you are cordially invited to
${eventName}
A Royal ${eventType} Celebration!

There will be royal activities, magical moments, and delicious treats
fit for royalty!

DATE: ${dateString}
TIME: ${timeString}
CASTLE LOCATION: [Insert Location]

Please RSVP to the Royal Messenger (${hostName}) by [Insert RSVP Date]

Attire: Your most royal outfits are encouraged!`,

    "Sports": `GAME ON! 🏆

${eventName}
A CHAMPIONSHIP ${eventType.toUpperCase()}!

Join our all-star lineup for games, competitions, and sports-themed fun!
Come dressed in your favorite sports gear and ready to play!

WHEN: ${dateString} at ${timeString}
WHERE: [Insert Location]
  
RSVP to Coach ${hostName} by [Insert RSVP Date]

Don't miss this winning celebration!`,

    "Space": `🚀 MISSION TO CELEBRATE 🚀

ATTENTION ALL ASTRONAUTS!
${eventName}
A Cosmic ${eventType}!

Join us for an interstellar celebration with cosmic games,
space-themed treats, and out-of-this-world fun!

LAUNCH DATE: ${dateString}
COUNTDOWN BEGINS: ${timeString}
MISSION CONTROL: [Insert Location]

RSVP to Ground Control (${hostName}) at [Contact] by [Insert RSVP Date]

Space attire encouraged but not required!`,
    
    "Dinosaur": `ROAR! You're invited to a DINO-MITE celebration!

${eventName}
A Prehistoric ${eventType}!

Stomp on over for prehistoric fun, fossil hunting, and jurassic treats!

DATE: ${dateString}
TIME: ${timeString}
EXCAVATION SITE: [Insert Location]

RSVP to ${hostName} by [Insert RSVP Date]

Dinosaur costumes and explorer gear welcome!`,
  };
  
  return invitations[theme] || `
You're Invited!

Please join us to celebrate
${eventName}
A special ${eventType}!

Hosted by: ${hostName}

DATE: ${dateString}
TIME: ${timeString}
LOCATION: [Insert Location]

RSVP to ${hostName} by [Insert RSVP Date]

We can't wait to celebrate with you!
  `;
}
