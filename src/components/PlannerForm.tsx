
import React, { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  eventType: z.string().min(2, { message: "Event type must be specified." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  hostName: z.string().min(2, { message: "Host name must be at least 2 characters." }),
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
  city: z.string().min(1, { message: "City must be specified." }),
  country: z.string().min(1, { message: "Country must be specified." }),
  interests: z.string().min(3, { message: "Please provide at least some interests or theme ideas." }),
  dietaryRestrictions: z.string().optional(),
  preferences: z.string().optional(),
  location: z.enum(["home", "outdoors", "venue", "other"]),
  foodPreferences: z.string().optional(),
  drinkPreferences: z.string().optional(),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PlannerForm() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResults, setPlanResults] = useState<any | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
      name: "",
      hostName: "",
      guests: "",
      guestType: "adults",
      budget: "",
      currency: "USD",
      city: "",
      country: "",
      interests: "",
      dietaryRestrictions: "",
      preferences: "",
      location: "venue",
      foodPreferences: "",
      drinkPreferences: "",
      additionalDetails: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    toast({
      title: "Generating event plans",
      description: "Our AI is creating personalized event plans for you...",
    });

    try {
      const result = await generatePartyPlan(data);
      setPlanResults(result);
      setStep(4);
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

  const nextStep = () => {
    let currentStepValid;
    
    if (step === 1) {
      currentStepValid = form.trigger(["eventType", "name", "hostName", "date", "guests", "guestType"]);
    } else if (step === 2) {
      currentStepValid = form.trigger(["budget", "currency", "city", "country", "location"]);
    } else {
      currentStepValid = form.trigger(["interests", "dietaryRestrictions", "foodPreferences", "drinkPreferences", "additionalDetails"]);
    }

    currentStepValid.then((valid) => {
      if (valid) setStep(step + 1);
    });
  };

  const prevStep = () => setStep(step - 1);

  if (step === 4 && planResults) {
    return <PartyPlanResults results={planResults} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
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
                  <FormLabel className="text-white font-medium">Event Name/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Host Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Who is hosting this event?" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Number of Guests</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number of guests" className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter budget amount" className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                        <SelectItem value="JPY">JPY - ¥</SelectItem>
                        <SelectItem value="CAD">CAD - C$</SelectItem>
                        <SelectItem value="AUD">AUD - A$</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                      <Input placeholder="Enter country" className="bg-gray-700 border-gray-600 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Theme Ideas/Interests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter theme ideas or interests" 
                      className="bg-gray-700 border-gray-600 text-white min-h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    What themes or activities would you like to include? (e.g., sports, movies, formal, casual)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foodPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Food Preferences</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What kind of food would you like to serve?" 
                      className="bg-gray-700 border-gray-600 text-white" 
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
                  <FormLabel className="text-white font-medium">Drink Preferences</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What kind of drinks would you like to serve?" 
                      className="bg-gray-700 border-gray-600 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Dietary Restrictions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any dietary restrictions to consider?" 
                      className="bg-gray-700 border-gray-600 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Additional Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other information that might help with planning" 
                      className="bg-gray-700 border-gray-600 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button type="button" variant="outline" className="border-gray-600 text-white hover:bg-gray-700" onClick={prevStep}>
              Previous
            </Button>
          )}
          
          {step < 3 ? (
            <Button type="button" className="bg-blue-600 hover:bg-blue-700 ml-auto" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
              {isGenerating ? "Generating..." : "Generate Event Plans"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
