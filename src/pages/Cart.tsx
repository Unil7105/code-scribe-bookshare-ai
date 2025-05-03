
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

interface CartItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    condition: string;
    cover_image: string | null;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      navigate("/auth");
    }
  }, [user]);

  async function fetchCartItems() {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          book:book_id (
            id, 
            title, 
            author, 
            price,
            condition,
            cover_image
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setCartItems(data as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load your cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(cartItemId: string) {
    setRemoveLoading(cartItemId);
    
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) throw error;
      
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      toast({
        title: "Success",
        description: "Book removed from cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove book from cart",
        variant: "destructive",
      });
    } finally {
      setRemoveLoading(null);
    }
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.book?.price || 0), 
    0
  );

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <div className="mx-auto bg-muted rounded-full w-20 h-20 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Link to="/books">
              <Button>
                Browse Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border rounded-lg overflow-hidden bg-card">
                  <Link to={`/books/${item.book.id}`} className="w-24 h-24 bg-muted flex-shrink-0">
                    <img
                      src={item.book.cover_image || "/placeholder.svg"}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <Link to={`/books/${item.book.id}`} className="font-semibold hover:text-primary">
                        {item.book.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">by {item.book.author}</p>
                      <div className="mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                          {item.book.condition}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">${item.book.price.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        disabled={removeLoading === item.id}
                      >
                        {removeLoading === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <div className="sticky top-24 border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({cartItems.length})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
