
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Age must be a positive number.",
  }),
  guests: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Number of guests must be a non-negative number.",
  }),
  budget: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Budget must be a positive number.",
  }),
  interests: z.string().min(3, { message: "Please provide at least some interests." }),
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
      name: "",
      age: "",
      guests: "",
      budget: "",
      interests: "",
      dietaryRestrictions: "",
      preferences: "",
      location: "home",
      additionalDetails: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    toast({
      title: "Generating party plans",
      description: "Our AI is creating personalized party plans for you...",
    });

    try {
      const result = await generatePartyPlan(data);
      setPlanResults(result);
      setStep(3);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate party plans. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating plans:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    const currentStepValid = [
      form.trigger(["name", "age", "guests"]),
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthday Person's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (or turning age)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter age" {...field} />
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
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number of guests" {...field} />
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
                  <FormLabel>Budget ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter budget" {...field} />
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
                  <FormLabel>Party Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormLabel>Interests/Hobbies</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter interests or hobbies" {...field} />
                  </FormControl>
                  <FormDescription>
                    What does the birthday person enjoy? (e.g., sports, movies, gaming, art)
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
                  <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any dietary restrictions to consider?" {...field} />
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
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other information that might help with planning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          
          {step < 2 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Party Plans"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
