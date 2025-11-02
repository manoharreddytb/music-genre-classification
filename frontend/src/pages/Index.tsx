import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Sparkles, Brain, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary shadow-lg">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2 text-primary-foreground">
            <div className="rounded-full bg-primary p-2">
              <Music className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Genre Classifier</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/20 p-6 animate-pulse-glow">
                <Music className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              AI-Powered Music Genre Classification
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the genre of any song using advanced machine learning models. 
              Train your own classifier or use our pretrained models.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link to="/predict" className="group animate-slide-in">
              <div className="h-full rounded-2xl bg-card p-8 shadow-lg border border-border hover:border-primary transition-all hover:shadow-xl hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-primary/20 p-4 group-hover:bg-primary/30 transition-colors">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Predict Genre
                  </h2>
                  <p className="text-muted-foreground">
                    Upload any audio file and get instant predictions from SVM and Random Forest models
                  </p>
                  <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all gap-2">
                    Try Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/train" className="group animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-full rounded-2xl bg-card p-8 shadow-lg border border-border hover:border-primary transition-all hover:shadow-xl hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-primary/20 p-4 group-hover:bg-primary/30 transition-colors">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Train Custom Model
                  </h2>
                  <p className="text-muted-foreground">
                    Upload your own dataset and train a personalized genre classifier with multi-language support
                  </p>
                  <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all gap-2">
                    Get Started
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Features List */}
          <div className="mt-16 rounded-2xl bg-card p-8 shadow-lg border border-border animate-fade-in">
            <h3 className="text-2xl font-bold text-foreground mb-6">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pretrained Models</p>
                  <p className="text-sm text-muted-foreground">SVM & Random Forest on GTZAN dataset</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Custom Training</p>
                  <p className="text-sm text-muted-foreground">Train on your own dataset with ease</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Multi-language Support</p>
                  <p className="text-sm text-muted-foreground">English, Tamil, Telugu, Hindi, Kannada</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Visual Comparison</p>
                  <p className="text-sm text-muted-foreground">Compare predictions across models</p>
                </div>
              </div>
            </div>
          </div>

          {/* Backend Notice */}
          <div className="mt-8 rounded-xl bg-muted/50 p-6 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This frontend requires a Flask backend running on <code className="px-2 py-1 rounded bg-card text-primary">localhost:5000</code>.
              Check the backend implementation guide for setup instructions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
