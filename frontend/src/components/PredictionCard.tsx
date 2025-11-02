import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";
import { Progress } from "./ui/progress";

interface Prediction {
  genre: string;
  confidence: number;
}

interface PredictionCardProps {
  model: string;
  prediction: Prediction;
  index: number;
}

const PredictionCard = ({ model, prediction, index }: PredictionCardProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-primary";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <ChatBubble 
      type={index % 2 === 0 ? "received" : "sent"}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wide opacity-80">
          {model}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">{prediction.genre}</span>
          <span className="text-lg font-semibold">
            {(prediction.confidence * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="space-y-1">
          <Progress 
            value={prediction.confidence * 100} 
            className="h-2"
          />
          <p className="text-xs opacity-70">
            Confidence Score
          </p>
        </div>
      </div>
    </ChatBubble>
  );
};

export default PredictionCard;
