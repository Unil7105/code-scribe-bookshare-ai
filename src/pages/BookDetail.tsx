
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, ShoppingCart, Share2, ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  description: string | null;
  cover_image: string | null;
  user_id: string | null;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to convert numeric IDs to valid UUIDs
  const getValidUuid = (id: string | undefined): string => {
    if (!id) return "";
    return isNaN(Number(id)) ? id : `00000000-0000-0000-0000-${id.padStart(12, '0')}`;
  };

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  useEffect(() => {
    if (user && book) {
      checkCartStatus();
      checkSaveStatus();
    }
  }, [user, book]);

  async function fetchBook(bookId: string) {
    try {
      const validBookId = getValidUuid(bookId);
      
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", validBookId)
        .single();

      if (error) {
        throw error;
      }
      
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast({
        title: "Error",
        description: "Failed to load book details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function checkCartStatus() {
    if (!user || !book) return;
    
    try {
      const validBookId = getValidUuid(book.id);
      
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("book_id", validBookId)
        .maybeSingle();

      if (error) throw error;
      
      setIsInCart(!!data);
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  }

  async function checkSaveStatus() {
    if (!user || !book) return;
    
    try {
      const validBookId = getValidUuid(book.id);
      
      const { data, error } = await supabase
        .from("saved_books")
        .select("*")
        .eq("user_id", user.id)
        .eq("book_id", validBookId)
        .maybeSingle();

      if (error) throw error;
      
      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  }

  async function handleAddToCart() {
    if (!user || !book) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add books to your cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setCartLoading(true);
    
    try {
      const validBookId = getValidUuid(book.id);
      
      if (isInCart) {
        // Remove from cart
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", validBookId);

        if (error) throw error;
        
        setIsInCart(false);
        toast({
          title: "Success",
          description: "Book removed from cart",
        });
      } else {
        // Add to cart
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          book_id: validBookId,
        });

        if (error) throw error;
        
        setIsInCart(true);
        toast({
          title: "Success",
          description: "Book added to cart",
        });
      }
    } catch (error: any) {
      console.error("Cart operation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setCartLoading(false);
    }
  }

  async function handleSaveBook() {
    if (!user || !book) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save books",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setSaveLoading(true);
    
    try {
      const validBookId = getValidUuid(book.id);
      
      if (isSaved) {
        // Unsave book
        const { error } = await supabase
          .from("saved_books")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", validBookId);

        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Success",
          description: "Book removed from saved list",
        });
      } else {
        // Save book
        const { error } = await supabase.from("saved_books").insert({
          user_id: user.id,
          book_id: validBookId,
        });

        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Success",
          description: "Book saved to your list",
        });
      }
    } catch (error: any) {
      console.error("Save operation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update saved books",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  }

  function handleBuyNow() {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase books",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    // Add to cart if not already there
    if (!isInCart) {
      handleAddToCart();
    }
    
    // Navigate to cart/checkout
    navigate("/cart");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="mb-8">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/books">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/books" className="inline-flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-muted rounded-lg overflow-hidden shadow-md">
            <img
              src={book?.cover_image || "/placeholder.svg"}
              alt={book?.title}
              className="w-full h-full object-contain aspect-[3/4]"
            />
          </div>
          
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {book?.category}
              </Badge>
              <Badge variant="secondary">
                {book?.condition}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold">{book?.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book?.author}</p>
            
            <div className="text-3xl font-bold mb-6 text-primary">${book?.price?.toFixed(2)}</div>
            
            <div className="flex flex-col space-y-4 mb-8">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              
              <div className="flex gap-4">
                <Button 
                  variant={isInCart ? "secondary" : "outline"} 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : isInCart ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {isInCart ? "In Cart" : "Add to Cart"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleSaveBook}
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Heart 
                      className={`h-5 w-5 mr-2 ${isSaved ? "fill-current text-red-500" : ""}`} 
                    />
                  )}
                  {isSaved ? "Saved" : "Save"}
                </Button>
                
                <Button variant="outline" onClick={() => {
                  navigator.share({
                    title: book?.title,
                    text: `Check out ${book?.title} by ${book?.author} on BookShare!`,
                    url: window.location.href
                  }).catch(err => console.error('Error sharing:', err));
                }}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground">{book?.description || "No description available"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
