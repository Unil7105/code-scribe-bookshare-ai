
import React from "react";
import { Book, MessageCircle, MapPin } from "lucide-react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Book className="h-10 w-10 text-primary" />,
      title: "List Your Books",
      description:
        "Create listings for the textbooks you no longer need. Add details like condition, price, and photos.",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Connect with Buyers",
      description:
        "Receive messages from interested students. Negotiate prices securely through our platform.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Meet & Exchange",
      description:
        "Arrange a safe meeting spot on campus. Complete the transaction and confirm it through BookShare.",
    },
  ];

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How BookShare Works</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our platform makes it easy to buy and sell textbooks with fellow students.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
