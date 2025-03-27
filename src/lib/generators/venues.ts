
export function generateVenueSuggestions(theme: string, locationType: string, city: string): string[] {
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
