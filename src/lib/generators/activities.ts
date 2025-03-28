
export function generateActivities(theme: string, isKid: boolean, age?: number | null): string[] {
  // Default activities
  let activities = [
    "Interactive games",
    "Music and dancing",
    "Photo booth with props",
    "Prize giveaways"
  ];

  // Theme-specific activities
  const themeActivities: Record<string, string[]> = {
    "superhero": [
      "Superhero costume contest",
      "Obstacle course (save the city)",
      "Design your own superhero mask",
      "Superhero trivia game"
    ],
    "princess": [
      "Royal makeover station",
      "Treasure hunt for the royal jewels",
      "Princess etiquette class",
      "Carriage rides"
    ],
    "sports": [
      "Mini tournament of the featured sport",
      "Sports skills challenges",
      "Indoor/outdoor games",
      "Sports memorabilia showcase"
    ],
    "space": [
      "Build and launch small rockets",
      "Space-themed scavenger hunt",
      "Create alien slime",
      "Planetarium show (if available)"
    ],
    "dinosaur": [
      "Dinosaur fossil dig",
      "Dino egg hunt",
      "Create dinosaur crafts",
      "Dinosaur identification game"
    ]
  };

  // If theme matches our predefined themes, use those activities
  const lowerTheme = theme.toLowerCase();
  if (themeActivities[lowerTheme]) {
    activities = themeActivities[lowerTheme];
  }

  // Age-specific adjustments if it's a birthday and we have the age
  if (age !== null && age !== undefined) {
    // For very young children (0-3)
    if (age <= 3) {
      return [
        "Simple sensory play stations",
        "Bubble play",
        "Age-appropriate music and dancing",
        "Storybook corner"
      ];
    }
    // For young children (4-7)
    else if (age <= 7) {
      return [
        "Simple crafts with assistance",
        "Musical chairs or similar games",
        "Treasure hunt with easy clues", 
        "Short magic show"
      ];
    }
    // For older children (8-12)
    else if (age <= 12) {
      return [
        "Team-building games",
        "Arts and crafts station",
        "Scavenger hunt with challenging clues",
        "Talent show"
      ];
    }
    // For teenagers (13-19)
    else if (age <= 19) {
      return [
        "Video game tournament",
        "Escape room challenges",
        "Karaoke or DJ booth",
        "Photography contest"
      ];
    }
    // For young adults (20-30)
    else if (age <= 30) {
      return [
        "Cocktail mixing class",
        "Interactive games or friendly competition",
        "Photo booth with props",
        "Live music or DJ"
      ];
    }
    // For adults (31-50)
    else if (age <= 50) {
      return [
        "Wine or beer tasting",
        "Interactive dinner games",
        "Dance floor with professional instructor",
        "Trivia or board games"
      ];
    }
    // For older adults (51+)
    else {
      return [
        "Memory sharing station",
        "Relaxed games (cards, board games)",
        "Live music from their era",
        "Photo montage presentation"
      ];
    }
  }

  // Kid-specific adjustments
  if (isKid) {
    activities = activities.map(activity => {
      if (activity.includes("cocktail") || activity.includes("wine")) {
        return "Juice bar with fun, colorful drinks";
      }
      return activity;
    });
    
    // Add some kid-specific activities
    activities.push("Face painting");
    activities.push("Balloon artist");
  }

  return activities;
}
