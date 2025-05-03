
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface BookProps {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  coverImage: string;
}

const BookCard: React.FC<BookProps> = ({
  id,
  title,
  author,
  price,
  condition,
  category,
  coverImage,
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800";
      case "like new":
        return "bg-blue-100 text-blue-800";
      case "very good":
        return "bg-teal-100 text-teal-800";
      case "good":
        return "bg-amber-100 text-amber-800";
      case "acceptable":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link to={`/books/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] h-full flex flex-col">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={coverImage}
            alt={`${title} by ${author}`}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="pt-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className={getConditionColor(condition)}>
              {condition}
            </Badge>
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{author}</p>
        </CardContent>
        <CardFooter className="pt-0 pb-3">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookCard;
