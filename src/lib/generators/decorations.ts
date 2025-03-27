
export function generateDecorations(theme: string): string[] {
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
