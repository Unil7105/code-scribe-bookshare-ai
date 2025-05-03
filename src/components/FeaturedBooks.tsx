
import React from "react";
import BookCard, { BookProps } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedBooksProps {
  title: string;
  books: BookProps[];
  viewAllLink?: string;
}

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({ title, books, viewAllLink = "/books" }) => {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button variant="ghost" className="gap-1 group">
                View all
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              {...book} 
              showActions={false} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
