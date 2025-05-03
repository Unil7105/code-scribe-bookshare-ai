
import React from "react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-accent to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Campus Book Exchange
              <br />
              <span className="text-primary">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Buy, sell and exchange textbooks within your campus community. 
              Save money and reduce waste with BookShare.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg">Browse Books</Button>
              <Button variant="outline" size="lg">
                List Your Books
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[400px] w-full">
              <div className="absolute transform -rotate-6 left-[10%] top-[10%] animate-float" style={{ animationDelay: "0s" }}>
                <div className="w-48 h-64 bg-book-blue rounded shadow-lg"></div>
              </div>
              <div className="absolute transform rotate-3 right-[20%] top-[5%] animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="w-40 h-56 bg-book-green rounded shadow-lg"></div>
              </div>
              <div className="absolute transform rotate-[-12deg] left-[25%] top-[35%] animate-float" style={{ animationDelay: "1s" }}>
                <div className="w-44 h-60 bg-book-teal rounded shadow-lg"></div>
              </div>
              <div className="absolute transform rotate-6 right-[10%] bottom-[15%] animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="w-36 h-52 bg-book-amber rounded shadow-lg"></div>
              </div>
              <div className="absolute transform rotate-[-8deg] left-[5%] bottom-[5%] animate-float" style={{ animationDelay: "2s" }}>
                <div className="w-32 h-48 bg-book-red rounded shadow-lg"></div>
              </div>
              <div className="absolute transform rotate-[15deg] right-[30%] bottom-[10%] animate-float" style={{ animationDelay: "2.5s" }}>
                <div className="w-28 h-44 bg-book-violet rounded shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
