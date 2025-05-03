
import React from "react";
import BookCard, { BookProps } from "@/components/BookCard";

interface FeaturedBooksProps {
  title: string;
  books: BookProps[];
}

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({ title, books }) => {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
