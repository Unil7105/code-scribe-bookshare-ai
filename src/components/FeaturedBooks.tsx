
import React from "react";
import BookCard, { BookProps } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface FeaturedBooksProps {
  title: string;
  books: BookProps[];
  viewAllLink?: string;
}

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({ title, books, viewAllLink = "/books" }) => {
  const { user } = useAuth();
  
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Discover books from fellow students</p>
            <div className="flex gap-2">
              {user && (
                <Link to="/add-book">
                  <Button variant="outline" className="gap-2">
                    <BookPlus className="h-4 w-4" />
                    List Your Book
                  </Button>
                </Link>
              )}
              {viewAllLink && (
                <Link to={viewAllLink}>
                  <Button variant="ghost" className="gap-1 group">
                    View all
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              {...book} 
              showActions={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
