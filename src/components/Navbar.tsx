
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, Search, User, ShoppingCart, Heart, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Book className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BookShare</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center flex-1 px-4 md:px-8">
          <form 
            className="relative w-full max-w-md"
            onSubmit={handleSearch}
          >
            <Input
              type="search"
              placeholder="Search for books, authors..."
              className="w-full pl-4 pr-10 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>
          </form>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/books">
            <Button variant="ghost">Browse Books</Button>
          </Link>
          
          {user ? (
            <>
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/saved-books">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/add-book" className="w-full">List a Book</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-books" className="w-full">My Books</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <div className="rounded-md bg-primary p-1">
                      <Book className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">BookShare</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                
                <form 
                  className="relative mb-6"
                  onSubmit={(e) => {
                    handleSearch(e);
                    setIsSheetOpen(false);
                  }}
                >
                  <Input
                    type="search"
                    placeholder="Search for books, authors..."
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute inset-y-0 right-0"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </form>
                
                <div className="space-y-4 flex-1">
                  <Link 
                    to="/books"
                    className="block py-2 font-medium"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Browse Books
                  </Link>
                  
                  {user ? (
                    <>
                      <Link 
                        to="/cart"
                        className="flex items-center py-2 font-medium"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart
                      </Link>
                      
                      <Link 
                        to="/saved-books"
                        className="flex items-center py-2 font-medium"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Saved Books
                      </Link>
                      
                      <Link 
                        to="/add-book"
                        className="flex items-center py-2 font-medium"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Book className="h-5 w-5 mr-2" />
                        List a Book
                      </Link>
                      
                      <Link 
                        to="/profile"
                        className="flex items-center py-2 font-medium"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <User className="h-5 w-5 mr-2" />
                        Profile
                      </Link>
                    </>
                  ) : null}
                </div>
                
                {user ? (
                  <Button 
                    variant="ghost" 
                    className="justify-start px-0 mt-auto"
                    onClick={() => {
                      handleSignOut();
                      setIsSheetOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="mt-auto">
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        navigate("/auth");
                        setIsSheetOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
