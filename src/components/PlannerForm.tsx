
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PartyPlanResults } from "./PartyPlanResults";
import { generatePartyPlan } from "@/lib/ai";
import { CalendarIcon, Users, Utensils, Wine, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  eventType: z.string().min(2, { message: "Event type must be specified." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  hostName: z.string().min(2, { message: "Host name must be at least 2 characters." }),
  age: z.string().optional(),
  date: z.date({
    required_error: "Please select a date.",
  }),
  guests: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Number of guests must be a non-negative number.",
  }),
  guestType: z.string().min(1, { message: "Please select a guest type." }),
  budget: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Budget must be a positive number.",
  }),
  currency: z.string().min(1, { message: "Please select a currency." }),
  location: z.enum(["home", "outdoors", "venue", "restaurant", "virtual", "other"]),
  city: z.string().min(1, { message: "City must be specified." }),
  country: z.string().min(1, { message: "Country must be specified." }),
  interests: z.string().min(3, { message: "Please provide some interests or theme ideas." }),
  foodPreferences: z.string().optional(),
  drinkPreferences: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PlannerForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResults, setPlanResults] = useState<any | null>(null);
  const [showAgeField, setShowAgeField] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
      name: "",
      hostName: "",
      age: "",
      guests: "",
      guestType: "adults",
      budget: "",
      currency: "USD",
      city: "",
      country: "",
      interests: "",
      location: "venue",
      foodPreferences: "",
      drinkPreferences: "",
      dietaryRestrictions: "",
      additionalDetails: "",
    },
  });

  // Watch for event type changes to show/hide age field
  const eventType = form.watch("eventType");
  
  useEffect(() => {
    // Show age field if event type contains "birthday"
    setShowAgeField(eventType.toLowerCase().includes("birthday"));
  }, [eventType]);

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    toast({
      title: "Generating event plans",
      description: "Our AI is creating personalized event plans for you...",
    });

    try {
      const result = await generatePartyPlan(data);
      setPlanResults(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate event plans. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating plans:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (planResults) {
    return <PartyPlanResults results={planResults} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto px-1">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Event Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Birthday, Wedding, Corporate Event" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Who is this event for?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Who is planning this event?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {showAgeField && (
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Age of the celebrant</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter age" 
                        className="bg-gray-700 border-gray-600 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            )}

            {!showAgeField && (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white font-medium">Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                              !field.value && "text-gray-400"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            )}
          </div>

          {showAgeField && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white font-medium">Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          )}

          <Separator className="bg-gray-700" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Guest Count
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="How many guests?" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Guest Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select guest type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="adults">Adults Only</SelectItem>
                      <SelectItem value="children">Children Only</SelectItem>
                      <SelectItem value="family">Family (Adults & Children)</SelectItem>
                      <SelectItem value="teenagers">Teenagers</SelectItem>
                      <SelectItem value="mixed">Mixed Age Groups</SelectItem>
                      <SelectItem value="seniors">Seniors</SelectItem>
                      <SelectItem value="corporate">Corporate/Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Budget
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter budget amount" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="USD">USD - $</SelectItem>
                      <SelectItem value="EUR">EUR - €</SelectItem>
                      <SelectItem value="GBP">GBP - £</SelectItem>
                      <SelectItem value="NIS">NIS - ₪</SelectItem>
                      <SelectItem value="JPY">JPY - ¥</SelectItem>
                      <SelectItem value="CAD">CAD - C$</SelectItem>
                      <SelectItem value="AUD">AUD - A$</SelectItem>
                      <SelectItem value="INR">INR - ₹</SelectItem>
                      <SelectItem value="CNY">CNY - ¥</SelectItem>
                      <SelectItem value="BRL">BRL - R$</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <Separator className="bg-gray-700" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Event Location Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="home">At Home</SelectItem>
                      <SelectItem value="outdoors">Outdoors (Park, Beach, etc.)</SelectItem>
                      <SelectItem value="venue">Venue/Rented Space</SelectItem>
                      <SelectItem value="restaurant">Restaurant/Bar</SelectItem>
                      <SelectItem value="virtual">Virtual/Online</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" className="bg-gray-700 border-gray-600 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" className="bg-gray-700 border-gray-600 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="bg-gray-700" />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">Theme Ideas/Interests</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What themes or interests should we include?" 
                    className="bg-gray-700 border-gray-600 text-white resize-none h-20" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Tell us about themes, activities, or special interests
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="foodPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium flex items-center">
                    <Utensils className="mr-2 h-4 w-4" />
                    Food Preferences
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What kind of food would you like?" 
                      className="bg-gray-700 border-gray-600 text-white resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="drinkPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium flex items-center">
                    <Wine className="mr-2 h-4 w-4" />
                    Drink Preferences
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What kind of drinks would you like?" 
                      className="bg-gray-700 border-gray-600 text-white resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">Dietary Restrictions</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Any allergies or dietary needs?" 
                    className="bg-gray-700 border-gray-600 text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
            {isGenerating ? "Generating..." : "Create My Event Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
