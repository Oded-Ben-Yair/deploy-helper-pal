
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartyPlan, VenueDetails as VenueDetailsType } from "@/types/chat";
import { Check, MapPin, Phone, DollarSign, Users, Star } from "lucide-react";

// Mock data for venue details - in a real app, this would come from an API
const getMockVenueDetails = (venue: string, city: string): VenueDetailsType => {
  return {
    name: venue,
    address: `123 Main St, ${city}`,
    price: Math.floor(Math.random() * 500) + 500,
    capacity: Math.floor(Math.random() * 50) + 50,
    amenities: [
      "Wi-Fi", 
      "Sound System", 
      "Catering Options",
      "Free Parking", 
      "Wheelchair Accessible"
    ],
    contactInfo: "+1 (555) 123-4567",
    availability: Math.random() > 0.3 // 70% chance it's available
  };
};

type VenueDetailsProps = {
  plan: PartyPlan;
  onClose: () => void;
  onBook: (venue: VenueDetailsType) => void;
};

export function VenueDetails({ plan, onClose, onBook }: VenueDetailsProps) {
  const [selectedVenue, setSelectedVenue] = useState<VenueDetailsType | null>(null);
  
  // Generate mock venue details for each venue suggestion
  const venueDetails = plan.venues.map(venue => 
    getMockVenueDetails(venue, plan.location.split(',')[0])
  );
  
  const handleSelectVenue = (venue: VenueDetailsType) => {
    setSelectedVenue(venue);
  };
  
  const handleBookVenue = () => {
    if (selectedVenue) {
      onBook(selectedVenue);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Venue Options for {plan.title}</h2>
      
      <Tabs defaultValue="venues" className="w-full">
        <TabsList className="w-full bg-gray-800">
          <TabsTrigger value="venues" className="text-white">Available Venues</TabsTrigger>
          <TabsTrigger value="selected" className="text-white" disabled={!selectedVenue}>
            Selected Venue
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="venues" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venueDetails.map((venue, index) => (
              <Card key={index} className={`bg-gray-800 border-gray-700 hover:border-blue-500 transition-all ${selectedVenue?.name === venue.name ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex justify-between items-start">
                    <span>{venue.name}</span>
                    {venue.availability ? (
                      <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">Available</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full">Unavailable</span>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" /> {venue.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-300">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> 
                      <span>{plan.estimatedCost.split(' ')[0]} {venue.price}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" /> 
                      <span>Up to {venue.capacity} people</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <strong className="block mb-1">Amenities:</strong>
                    <ul className="grid grid-cols-2 gap-1">
                      {venue.amenities.map((amenity, i) => (
                        <li key={i} className="flex items-center text-xs">
                          <Check className="h-3 w-3 mr-1 text-green-400" /> {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex items-center text-gray-400">
                    <Phone className="h-4 w-4 mr-1" /> {venue.contactInfo}
                  </div>
                  <Button 
                    onClick={() => handleSelectVenue(venue)} 
                    variant="outline"
                    disabled={!venue.availability}
                    className="border-blue-500 text-blue-400 hover:bg-blue-950"
                  >
                    Select
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="selected">
          {selectedVenue && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedVenue.name}</h3>
                  <p className="text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {selectedVenue.address}
                  </p>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-1" /> {selectedVenue.contactInfo}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Venue Details</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>Price: {plan.estimatedCost.split(' ')[0]} {selectedVenue.price}</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Capacity: Up to {selectedVenue.capacity} people</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      <span>Rating: 4.7/5 (24 reviews)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Amenities</h4>
                  <ul className="grid grid-cols-1 gap-1 text-gray-300">
                    {selectedVenue.amenities.map((amenity, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-400" /> {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-700">
                <div className="text-white mb-4">
                  <h4 className="font-semibold mb-2">Booking Summary</h4>
                  <p>Selected for: {plan.title}</p>
                  <p>Date: To be confirmed</p>
                  <p>Number of Guests: Approximately {plan.title.includes('Intimate') ? '15-30' : '30-50'} people</p>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-white hover:bg-gray-700"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleBookVenue}
                  >
                    Book Venue
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
