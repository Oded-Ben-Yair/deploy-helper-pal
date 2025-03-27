
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

const formSchema = z.object({
  eventType: z.string().min(2, { message: "Event type must be specified." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  date: z.string().min(2, { message: "Date must be specified." }),
  guests: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Number of guests must be a non-negative number.",
  }),
  budget: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Budget must be a positive number.",
  }),
  interests: z.string().min(3, { message: "Please provide at least some interests or theme ideas." }),
  dietaryRestrictions: z.string().optional(),
  preferences: z.string().optional(),
  location: z.enum(["home", "outdoors", "venue", "other"]),
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
      date: "",
      guests: "",
      budget: "",
      interests: "",
      dietaryRestrictions: "",
      preferences: "",
      location: "venue",
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
      setStep(3);
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
    const currentStepValid = [
      form.trigger(["eventType", "name", "date", "guests"]),
      form.trigger(["budget", "interests", "location", "dietaryRestrictions", "preferences", "additionalDetails"]),
    ][step - 1];

    currentStepValid.then((valid) => {
      if (valid) setStep(step + 1);
    });
  };

  const prevStep = () => setStep(step - 1);

  if (step === 3 && planResults) {
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
                  <FormLabel className="text-white">Event Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Birthday, Wedding, Corporate Event" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Event Name/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Event Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/DD/YYYY" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Number of Guests</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number of guests" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Budget ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter budget" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Event Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="home">At Home</SelectItem>
                      <SelectItem value="outdoors">Outdoors (Park, Beach, etc.)</SelectItem>
                      <SelectItem value="venue">Venue/Rented Space</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Theme Ideas/Interests</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter theme ideas or interests" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    What themes or activities would you like to include? (e.g., sports, movies, formal, casual)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Dietary Restrictions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any dietary restrictions to consider?" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other information that might help with planning" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
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
          
          {step < 2 ? (
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
