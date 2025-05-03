
import React from "react";
import { Book, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Book className="h-12 w-12 text-primary" />,
      title: "List Your Books",
      description:
        "Create listings for the textbooks you no longer need. Add details like condition, price, and photos.",
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-primary" />,
      title: "Connect with Buyers",
      description:
        "Receive messages from interested students. Negotiate prices securely through our platform.",
    },
    {
      icon: <MapPin className="h-12 w-12 text-primary" />,
      title: "Meet & Exchange",
      description:
        "Arrange a safe meeting spot on campus. Complete the transaction and confirm it through BookShare.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/80 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-3">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How BookShare Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform makes it easy to buy and sell textbooks with fellow students on campus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-300"></div>
                <div className="relative p-5 bg-background rounded-full border border-border shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-y-1/2"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link to="/add-book">Start Listing Your Books</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
