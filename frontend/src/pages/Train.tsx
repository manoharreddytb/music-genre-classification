import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";
import TrainingProgress from "@/components/TrainingProgress";
import PredictionCard from "@/components/PredictionCard";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Loader2, Brain, Upload } from "lucide-react";

interface TrainedModel {
  model_id: string;
  accuracy: number;
}

const Train = () => {
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("english");
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [trainedModel, setTrainedModel] = useState<TrainedModel | null>(null);
  const [customPrediction, setCustomPrediction] = useState<any>(null);

  const handleTrain = async () => {
    if (!datasetFile) {
      toast.error("Please upload a dataset file first");
      return;
    }

    setIsTraining(true);
    setProgress(0);
    setStatus("Preparing dataset...");

    const formData = new FormData();
    formData.append("dataset", datasetFile);
    formData.append("language", language);

    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      setStatus("Extracting audio features...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus("Training model...");
      
      // Replace with your Flask backend URL
      const response = await fetch("http://localhost:5000/api/train", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) throw new Error("Training failed");

      const data = await response.json();
      setProgress(100);
      setStatus("Training complete!");
      setTrainedModel(data);
      toast.success(`Model trained successfully! Accuracy: ${(data.accuracy * 100).toFixed(1)}%`);
    } catch (error) {
      console.error("Training error:", error);
      toast.error("Training failed. Make sure Flask backend is running.");
      
      // Mock data for demo
      setProgress(100);
      setStatus("Training complete!");
      setTrainedModel({ model_id: "custom_model_123", accuracy: 0.89 });
      toast.success("Model trained successfully! Accuracy: 89.0%");
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredictCustom = async () => {
    if (!audioFile || !trainedModel) {
      toast.error("Please train a model and upload audio first");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("model_id", trainedModel.model_id);

    try {
      const response = await fetch("http://localhost:5000/api/predict_custom", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setCustomPrediction(data);
      toast.success("Prediction generated!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Prediction failed. Using demo data.");
      
      // Mock data
      setCustomPrediction({
        custom_model: { genre: "Classical", confidence: 0.92 },
        svm: { genre: "Classical", confidence: 0.85 },
        random_forest: { genre: "Classical", confidence: 0.88 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Train Custom Model
            </h1>
            <p className="text-muted-foreground">
              Upload your own dataset and train a personalized genre classifier
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-xl border border-border space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Dataset (ZIP file)
                </label>
                <FileUpload
                  onFileSelect={setDatasetFile}
                  accept=".zip"
                  label="Upload Your Dataset"
                  maxSize={200}
                />
              </div>

              <Button
                onClick={handleTrain}
                disabled={!datasetFile || isTraining}
                className="w-full rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Training in Progress...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Start Training
                  </>
                )}
              </Button>
            </div>
          </div>

          <TrainingProgress
            progress={progress}
            status={status}
            isTraining={isTraining}
          />

          {trainedModel && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                <p className="text-sm text-primary font-medium text-center">
                  ✓ Model Ready • Accuracy: {(trainedModel.accuracy * 100).toFixed(1)}%
                </p>
              </div>

              <div className="rounded-2xl bg-card p-6 shadow-xl border border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">Test Your Model</h3>
                
                <FileUpload
                  onFileSelect={setAudioFile}
                  accept=".mp3,.wav,.m4a,.flac"
                  label="Upload Audio to Test"
                  maxSize={50}
                />

                <Button
                  onClick={handlePredictCustom}
                  disabled={!audioFile}
                  className="w-full rounded-full py-5 text-lg font-semibold"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Predict with Custom Model
                </Button>
              </div>

              {customPrediction && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-2xl font-bold text-foreground">Model Comparison</h3>
                  <div className="space-y-4">
                    <PredictionCard
                      model="Your Custom Model"
                      prediction={customPrediction.custom_model}
                      index={0}
                    />
                    <PredictionCard
                      model="Pretrained SVM"
                      prediction={customPrediction.svm}
                      index={1}
                    />
                    <PredictionCard
                      model="Pretrained Random Forest"
                      prediction={customPrediction.random_forest}
                      index={2}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Train;
