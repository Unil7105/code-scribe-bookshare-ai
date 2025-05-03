
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BookPlus, Filter, Search } from "lucide-react";
import BookCard from "@/components/BookCard";
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
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
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

  // Filter books based on search term, category, and condition
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter ? book.category === categoryFilter : true;
    const matchesCondition = conditionFilter ? book.condition === conditionFilter : true;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  // Sort books based on selected option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "title":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return 0; // Assuming the original order is by newest
    }
  });

  // Get unique categories and conditions
  const categories = [...new Set(books.map(book => book.category))];
  const conditions = [...new Set(books.map(book => book.condition))];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Browse Books</h1>
          
          {user && (
            <Link to="/add-book">
              <Button>
                <BookPlus className="mr-2 h-5 w-5" />
                List a Book
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex flex-col space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> 
              Filters
              {(categoryFilter || conditionFilter) && (
                <Badge variant="secondary" className="ml-2">
                  {(categoryFilter ? 1 : 0) + (conditionFilter ? 1 : 0)}
                </Badge>
              )}
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="title">Title: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-background shadow-sm">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
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
              
              <div>
                <label className="text-sm font-medium mb-1 block">Condition</label>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Condition</SelectItem>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(categoryFilter || conditionFilter) && (
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => {
                    setCategoryFilter("");
                    setConditionFilter("");
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : sortedBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                condition={book.condition}
                category={book.category}
                coverImage={book.cover_image || "/placeholder.svg"}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
