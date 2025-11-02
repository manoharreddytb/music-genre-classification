import { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import PredictionCard from "@/components/PredictionCard";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

interface PredictionResult {
  svm: { genre: string; confidence: number };
  random_forest: { genre: string; confidence: number };
}

const Predict = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!selectedFile) {
      toast.error("Please upload an audio file first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio", selectedFile);

    try {
      // Replace with your Flask backend URL
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setPredictions(data);
      toast.success("Predictions generated successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to predict genre. Make sure Flask backend is running.");
      
      // Mock data for demo purposes
      setPredictions({
        svm: { genre: "Rock", confidence: 0.87 },
        random_forest: { genre: "Rock", confidence: 0.91 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Predict Genre
            </h1>
            <p className="text-muted-foreground">
              Upload any audio file and let AI predict its genre using SVM and Random Forest models
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-xl border border-border space-y-6">
            <FileUpload
              onFileSelect={setSelectedFile}
              accept=".mp3,.wav,.m4a,.flac"
              label="Upload Your Audio File"
              maxSize={50}
            />

            <Button
              onClick={handlePredict}
              disabled={!selectedFile || isLoading}
              className="w-full rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Audio...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Predict Genre
                </>
              )}
            </Button>
          </div>

          {predictions && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground">Predictions</h2>
              <div className="space-y-4">
                <PredictionCard
                  model="SVM Model"
                  prediction={predictions.svm}
                  index={0}
                />
                <PredictionCard
                  model="Random Forest"
                  prediction={predictions.random_forest}
                  index={1}
                />
              </div>
              
              <div className="rounded-xl bg-card p-4 border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  {predictions.svm.genre === predictions.random_forest.genre
                    ? `Both models agree! This song is most likely ${predictions.svm.genre}.`
                    : `Models disagree - SVM suggests ${predictions.svm.genre}, Random Forest suggests ${predictions.random_forest.genre}.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Predict;
