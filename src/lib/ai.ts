
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
    "Gaming", "Art", "Music", "Animals", "Ocean", "Magic", "Science"
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
  const plans = relevantThemes.map((theme, index) => {
    const age = parseInt(formData.age);
    const isKid = age < 13;
    
    // Generate activities based on age and theme
    const activities = generateActivities(theme, isKid);
    
    // Generate food ideas based on theme and dietary restrictions
    const foodIdeas = generateFoodIdeas(theme, formData.dietaryRestrictions);
    
    // Generate decorations based on theme
    const decorations = generateDecorations(theme);
    
    return {
      title: `${theme} Birthday Extravaganza`,
      description: `A fun-filled ${theme.toLowerCase()} themed party perfect for ${formData.name}, with activities and decorations that will create amazing memories.`,
      theme,
      activities,
      foodIdeas,
      decorations,
      estimatedCost: `$${totalBudget}`,
    };
  });
  
  // Generate invitation text
  const selectedTheme = plans[0].theme;
  const invitationText = generateInvitationText(formData.name, formData.age, selectedTheme);
  
  return {
    plans,
    invitationText,
    budgetBreakdown,
  };
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
  
  // Return activities for the theme, or default activities if theme not found
  return themeActivities[theme] || [
    "Birthday cake and presents",
    "Musical chairs",
    "Scavenger hunt",
    "Dance party",
  ];
}

function generateFoodIdeas(theme: string, dietaryRestrictions: string) {
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
  
  // Return food ideas for the theme, or default food if theme not found
  return themeFoods[theme] || [
    "Birthday cake",
    "Assorted finger foods",
    "Fruit platter",
    "Chips and dip",
  ];
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
  
  // Return decorations for the theme, or default decorations if theme not found
  return themeDecorations[theme] || [
    "Balloons and streamers",
    "Birthday banner",
    "Table centerpieces",
    "Party hats and favors",
  ];
}

function generateInvitationText(name: string, age: string, theme: string) {
  const invitations: Record<string, string> = {
    "Superhero": `CALLING ALL SUPERHEROES!

Your presence is requested for a SUPER birthday celebration!
${name} is turning ${age} and needs your superhero powers to make this day amazing!

Join us for epic adventures, heroic games, and super treats.
Don't forget your superhero costume!

DATE: [Insert Date]
TIME: [Insert Time]
LOCATION: [Insert Location]

RSVP to [Insert Contact] by [Insert Date]

With great power comes great birthday parties!`,

    "Princess": `🌟 ROYAL INVITATION 🌟

By royal decree, you are cordially invited to
Princess ${name}'s ${age}th Royal Birthday Celebration!

There will be royal activities, magical moments, and delicious treats
fit for royalty!

DATE: [Insert Date]
TIME: [Insert Time]
CASTLE LOCATION: [Insert Location]

Please RSVP to the Royal Messenger at [Insert Contact] by [Insert Date]

Attire: Your most royal outfits are encouraged!`,

    "Sports": `GAME ON! 🏆

${name} is turning ${age}, and we're celebrating with a
CHAMPIONSHIP BIRTHDAY PARTY!

Join our all-star lineup for games, competitions, and sports-themed fun!
Come dressed in your favorite sports gear and ready to play!

WHEN: [Insert Date and Time]
WHERE: [Insert Location]
  
RSVP to Coach [Insert Contact] by [Insert Date]

Don't miss this winning celebration!`,

    "Space": `🚀 MISSION TO CELEBRATE 🚀

ATTENTION ALL ASTRONAUTS!
${name} is turning ${age} and blasting off to another year!

Join us for an interstellar celebration with cosmic games,
space-themed treats, and out-of-this-world fun!

LAUNCH DATE: [Insert Date]
COUNTDOWN BEGINS: [Insert Time]
MISSION CONTROL: [Insert Location]

RSVP to Ground Control at [Insert Contact] by [Insert Date]

Space attire encouraged but not required!`,
    
    "Dinosaur": `ROAR! You're invited to a DINO-MITE celebration!

${name} is turning ${age}!

Stomp on over for prehistoric fun, fossil hunting, and jurassic treats!

DATE: [Insert Date]
TIME: [Insert Time]
EXCAVATION SITE: [Insert Location]

RSVP to [Insert Contact] by [Insert Date]

Dinosaur costumes and explorer gear welcome!`,
  };
  
  // Return invitation text for the theme, or a generic invitation if theme not found
  return invitations[theme] || `
You're Invited!

Please join us to celebrate
${name}'s ${age}th Birthday!

DATE: [Insert Date]
TIME: [Insert Time]
LOCATION: [Insert Location]

RSVP to [Insert Contact] by [Insert Date]

We can't wait to celebrate with you!
  `;
}
