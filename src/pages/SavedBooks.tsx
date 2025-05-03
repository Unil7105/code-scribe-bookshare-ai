
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Trash2, ArrowRight } from "lucide-react";

interface SavedBook {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    condition: string;
    category: string;
    cover_image: string | null;
  };
}

const SavedBooks = () => {
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSavedBooks();
    } else {
      navigate("/auth");
    }
  }, [user]);

  async function fetchSavedBooks() {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_books")
        .select(`
          id,
          book:book_id (
            id, 
            title, 
            author, 
            price,
            condition,
            category,
            cover_image
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setSavedBooks(data as SavedBook[]);
    } catch (error) {
      console.error("Error fetching saved books:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function removeFromSaved(savedBookId: string) {
    setRemoveLoading(savedBookId);
    
    try {
      const { error } = await supabase
        .from("saved_books")
        .delete()
        .eq("id", savedBookId);

      if (error) throw error;
      
      setSavedBooks(savedBooks.filter(item => item.id !== savedBookId));
      toast({
        title: "Success",
        description: "Book removed from saved list",
      });
    } catch (error) {
      console.error("Error removing from saved books:", error);
      toast({
        title: "Error",
        description: "Failed to remove book from saved list",
        variant: "destructive",
      });
    } finally {
      setRemoveLoading(null);
    }
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Saved Books</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : savedBooks.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <div className="mx-auto bg-muted rounded-full w-20 h-20 flex items-center justify-center">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">You haven't saved any books yet</h2>
            <p className="text-muted-foreground mb-6">
              Save books you're interested in to view them later
            </p>
            <Link to="/books">
              <Button>
                Browse Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedBooks.map((savedBook) => (
              <div key={savedBook.id} className="border rounded-lg overflow-hidden bg-card">
                <Link
                  to={`/books/${savedBook.book.id}`}
                  className="block aspect-[3/4] overflow-hidden bg-muted"
                >
                  <img
                    src={savedBook.book.cover_image || "/placeholder.svg"}
                    alt={savedBook.book.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/books/${savedBook.book.id}`}
                        className="font-semibold hover:text-primary line-clamp-1"
                      >
                        {savedBook.book.title}
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        by {savedBook.book.author}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 -mr-2 -mt-2"
                      onClick={() => removeFromSaved(savedBook.id)}
                      disabled={removeLoading === savedBook.id}
                    >
                      {removeLoading === savedBook.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">${savedBook.book.price.toFixed(2)}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                      {savedBook.book.condition}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/books/${savedBook.book.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBooks;
