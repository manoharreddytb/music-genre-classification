import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import PredictionCard from "@/components/PredictionCard";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Loader2, Mic, Square, Play, Pause } from "lucide-react";

interface PredictionResult {
  svm: { genre: string; confidence: number };
  random_forest: { genre: string; confidence: number };
}

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started! Sing your heart out 🎤");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please grant permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped!");
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePredict = async () => {
    if (!audioBlob) {
      toast.error("Please record audio first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setPredictions(data);
      toast.success("Genre predicted successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to predict genre. Make sure Flask backend is running.");
      
      // Mock data for demo purposes
      setPredictions({
        svm: { genre: "Pop", confidence: 0.89 },
        random_forest: { genre: "Pop", confidence: 0.92 }
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
              <Mic className="h-8 w-8 text-primary" />
              Record & Predict
            </h1>
            <p className="text-muted-foreground">
              Sing or hum a tune, and let AI predict what genre it matches!
            </p>
          </div>

          <div className="rounded-2xl bg-card p-8 shadow-xl border border-border space-y-6">
            <div className="flex flex-col items-center gap-4">
              {!isRecording && !audioBlob && (
                <Button
                  onClick={startRecording}
                  className="w-32 h-32 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <Mic className="h-12 w-12" />
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="w-32 h-32 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all animate-pulse"
                  size="lg"
                >
                  <Square className="h-12 w-12" />
                </Button>
              )}

              {isRecording && (
                <p className="text-primary font-semibold animate-pulse">
                  Recording... Tap to stop
                </p>
              )}

              {audioBlob && !isRecording && (
                <div className="w-full space-y-4">
                  <audio
                    ref={audioRef}
                    src={audioURL}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={togglePlayback}
                      variant="secondary"
                      className="rounded-full px-6"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Play Recording
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={startRecording}
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      <Mic className="mr-2 h-5 w-5" />
                      Record Again
                    </Button>
                  </div>

                  <Button
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="w-full rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Your Voice...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-5 w-5" />
                        Predict Genre
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
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
                    ? `Both models agree! Your voice sounds like ${predictions.svm.genre}.`
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

export default Record;
