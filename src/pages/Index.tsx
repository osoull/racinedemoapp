import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Racine Investment
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Shariah-compliant crowdfunding platform connecting innovative projects with ethical investors
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="btn-primary">
                Start Investing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button className="btn-secondary">
                Submit Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Racine Investment?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 card-hover">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Shariah Compliant</h3>
              <p className="text-gray-600">
                All investments are vetted for compliance with Islamic finance principles
              </p>
            </Card>
            <Card className="p-6 card-hover">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Join a growing community of ethical investors and innovative entrepreneurs
              </p>
            </Card>
            <Card className="p-6 card-hover">
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparent Fees</h3>
              <p className="text-gray-600">
                Clear and competitive commission structure with no hidden charges
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;