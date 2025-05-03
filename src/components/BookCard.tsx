
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface BookProps {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  coverImage: string;
  showActions?: boolean;
}

const BookCard: React.FC<BookProps> = ({
  id,
  title,
  author,
  price,
  condition,
  category,
  coverImage,
  showActions = false,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if the book is saved by the user when component mounts
    if (user) {
      checkSavedStatus();
    }
  }, [user, id]);

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

  async function checkSavedStatus() {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("saved_books")
        .select("*")
        .eq("user_id", user.id)
        .eq("book_id", id)
        .maybeSingle();

      if (error) throw error;
      
      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  }

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        book_id: id,
      });

      if (error) throw error;
      
      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const toggleSaveBook = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save books",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSaved) {
        // Remove from saved books
        const { error } = await supabase
          .from("saved_books")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", id);

        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Removed from saved",
          description: `${title} has been removed from your saved books`,
        });
      } else {
        // Add to saved books
        const { error } = await supabase.from("saved_books").insert({
          user_id: user.id,
          book_id: id,
        });

        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Book saved",
          description: `${title} has been saved to your collection`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update saved books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] h-full flex flex-col">
      <Link to={`/books/${id}`} className="flex-1 flex flex-col">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={coverImage || "/placeholder.svg"}
            alt={`${title} by ${author}`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 w-full flex justify-between p-2">
            <Badge variant="secondary" className={`${getConditionColor(condition)} shadow-sm`}>
              {condition}
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              ${price.toFixed(2)}
            </Badge>
          </div>
        </div>
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">by {author}</p>
          <Badge variant="outline" className="text-xs mt-2">
            {category}
          </Badge>
        </CardContent>
      </Link>
      
      {showActions && (
        <CardFooter className="pt-0 pb-4 flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={addToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleSaveBook}
            disabled={isLoading}
            className={isSaved ? "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" : ""}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookCard;
