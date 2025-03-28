
export function generateVenueSuggestions(theme: string, locationType: string, city: string, age?: number): string[] {
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
  
  // If we have age information, we can tailor venue suggestions
  if (age !== undefined && age !== null) {
    // For children's parties (ages 1-12)
    if (age <= 12) {
      if (locationType === "venue") {
        return [
          `Children's play center in ${city}`,
          "Indoor playground facility",
          "Children's museum with party space",
          "Party room at family entertainment center"
        ];
      } else if (locationType === "restaurant") {
        return [
          "Pizza restaurant with play area",
          "Family-friendly restaurant with kids' menu",
          "Ice cream parlor with party space",
          "Fast-casual venue with kids' entertainment"
        ];
      }
    }
    // For teen parties (ages 13-19)
    else if (age <= 19) {
      if (locationType === "venue") {
        return [
          "Arcade or gaming center",
          "Trampoline park",
          "Laser tag arena",
          "Bowling alley with party room"
        ];
      }
    }
    // For milestone adult birthdays (21, 30, 40, 50, etc.)
    else if (age === 21 || age % 10 === 0) {
      if (locationType === "venue") {
        return [
          "Upscale event space",
          "Rooftop venue with city views",
          "Private club or lounge",
          "Landmark venue with historical significance"
        ];
      } else if (locationType === "restaurant") {
        return [
          "Fine dining restaurant with private room",
          "Wine bar with event space",
          "Chef's table experience",
          "Trendy hotspot with reserved section"
        ];
      }
    }
  }
  
  const themeMatch = locationSuggestions[locationType][theme.toLowerCase()] || 
                      locationSuggestions[locationType]["default"];
  
  return themeMatch || [
    `Venue in ${city}`,
    "Local event space",
    "Community center",
    "Hotel event room"
  ];
}
