
export function generateActivities(theme: string, isKid: boolean): string[] {
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
