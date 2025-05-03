
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BookPlus } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  description: string | null;
  cover_image: string | null;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    try {
      let query = supabase.from("books").select("*");

      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setBooks(data as Book[]);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter books based on search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter ? book.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(books.map(book => book.category))];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">All Books</h1>
          
          {user && (
            <Link to="/add-book">
              <Button>
                <BookPlus className="mr-2 h-5 w-5" />
                List a Book
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link 
                to={`/books/${book.id}`} 
                key={book.id}
                className="group border rounded-lg overflow-hidden bg-card transition-transform hover:scale-[1.02]"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={book.cover_image || "/placeholder.svg"}
                    alt={book.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">${book.price}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                      {book.condition}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
