
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedBooks from "@/components/FeaturedBooks";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { featuredBooks, recentlyAddedBooks } from "@/data/books";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedBooks title="Featured Books" books={featuredBooks.slice(0, 5)} />
        <HowItWorks />
        <FeaturedBooks title="Recently Added" books={recentlyAddedBooks.slice(0, 5)} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
