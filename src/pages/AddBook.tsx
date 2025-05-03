
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

const AddBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    condition: "",
    description: "",
  });

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a book",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let coverImageUrl = null;
      
      // Upload image if exists
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `book_covers/${fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(filePath, coverImage);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('books')
          .getPublicUrl(filePath);
          
        coverImageUrl = data.publicUrl;
      }
      
      // Insert book into database
      const { error } = await supabase.from("books").insert({
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        cover_image: coverImageUrl || 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=500&auto=format&fit=crop&q=80',
        user_id: user.id,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your book has been listed",
      });
      
      navigate("/books");
    } catch (error: any) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const conditions = ["New", "Like New", "Very Good", "Good", "Acceptable"];
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Mystery",
    "Biography",
    "History",
    "Mathematics",
    "Science",
    "Computer Science",
    "Business",
    "Self-Help",
    "Art",
    "Cooking",
    "Travel",
    "Children's",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">List a Book</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter the book title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter the author's name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description of the book"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, 500x500 pixels or larger
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  "List Book"
                )}
              </Button>
            </form>
          </div>
          
          <div className="order-first md:order-last">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="border rounded-lg p-4">
                <div className="aspect-[3/4] bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview}
                      alt="Book cover preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm p-4 text-center">
                      Cover image preview
                    </div>
                  )}
                </div>
                <h3 className="font-semibold">
                  {formData.title || "Book Title"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  by {formData.author || "Author Name"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">
                    ${formData.price ? parseFloat(formData.price).toFixed(2) : "0.00"}
                  </span>
                  {formData.condition && (
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                      {formData.condition}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
