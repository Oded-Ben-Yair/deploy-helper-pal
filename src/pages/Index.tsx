
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlannerForm } from "@/components/PlannerForm";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="container mx-auto py-10 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-3">AI Birthday Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create the perfect birthday celebration with AI-powered party planning
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card className="shadow-lg border-purple-100">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800">Plan a Birthday</CardTitle>
              <CardDescription>
                Let our AI assistant help you plan the perfect birthday party
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Fill out a simple form with details about the birthday person and preferences,
                and our AI will generate customized party plans.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Planning
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
                  <SheetHeader className="mb-5">
                    <SheetTitle>Birthday Party Planner</SheetTitle>
                    <SheetDescription>
                      Fill out the details below to get AI-generated birthday party plans.
                    </SheetDescription>
                  </SheetHeader>
                  <PlannerForm />
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-purple-100">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800">Features</CardTitle>
              <CardDescription>
                AI-powered planning to make birthdays special
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Smart theme suggestions based on interests</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Custom invitation texts crafted for the occasion</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Budget optimization for maximum enjoyment</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Activity recommendations tailored to age groups</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
