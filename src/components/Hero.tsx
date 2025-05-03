
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, Search } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-accent/80 via-accent/50 to-background">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium mb-2">
              <span className="animate-pulse rounded-full bg-primary h-2 w-2" />
              Campus Book Exchange Made Simple
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Find Your Next <span className="text-primary">Academic Companion</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with fellow students to buy, sell and exchange textbooks. 
              Save money and contribute to sustainable education with BookShare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/books">
                  <Search className="h-4 w-4" />
                  Browse Books
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/add-book">
                  <Book className="h-4 w-4 mr-2" />
                  List Your Books
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative h-[400px] w-full perspective-1000">
              {/* Book Stack - more realistic with drop shadows and better animation */}
              <div className="absolute transform -rotate-6 left-[10%] top-[10%] animate-float shadow-xl" style={{ animationDelay: "0s" }}>
                <div className="w-48 h-64 bg-book-blue rounded shadow-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-y-12 hover:scale-105">
                  <span className="rotate-6">Biology</span>
                </div>
              </div>
              <div className="absolute transform rotate-3 right-[20%] top-[5%] animate-float shadow-xl" style={{ animationDelay: "0.5s" }}>
                <div className="w-40 h-56 bg-book-green rounded shadow-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-y-12 hover:scale-105">
                  <span className="-rotate-3">Chemistry</span>
                </div>
              </div>
              <div className="absolute transform rotate-[-12deg] left-[25%] top-[35%] animate-float shadow-xl" style={{ animationDelay: "1s" }}>
                <div className="w-44 h-60 bg-book-teal rounded shadow-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-y-12 hover:scale-105">
                  <span className="rotate-12">Mathematics</span>
                </div>
              </div>
              <div className="absolute transform rotate-6 right-[10%] bottom-[15%] animate-float shadow-xl" style={{ animationDelay: "1.5s" }}>
                <div className="w-36 h-52 bg-book-amber rounded shadow-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-y-12 hover:scale-105">
                  <span className="-rotate-6">Physics</span>
                </div>
              </div>
              <div className="absolute transform rotate-[-8deg] left-[5%] bottom-[5%] animate-float shadow-xl" style={{ animationDelay: "2s" }}>
                <div className="w-32 h-48 bg-book-red rounded shadow-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-y-12 hover:scale-105">
                  <span className="rotate-8">English</span>
                </div>
              </div>
              <div className="absolute transform rotate-[15deg] right-[30%] bottom-[10%] animate-float shadow-xl" style={{ animationDelay: "2.5s" }}>
                <div className="w-28 h-44 bg-book-violet rounded shadow-lg flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-y-12 hover:scale-105">
                  <span className="-rotate-15">History</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute left-1/3 top-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
      </div>
    </section>
  );
};

export default Hero;
