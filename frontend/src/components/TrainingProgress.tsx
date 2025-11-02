import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";

interface TrainingProgressProps {
  progress: number;
  status: string;
  isTraining: boolean;
}

const TrainingProgress = ({ progress, status, isTraining }: TrainingProgressProps) => {
  if (!isTraining && progress === 0) return null;

  return (
    <div className="w-full space-y-4 rounded-xl bg-card p-6 shadow-lg animate-fade-in border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Training Progress</h3>
        {isTraining && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{status}</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {progress === 100 && (
        <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary animate-pulse-glow">
          ✓ Training completed successfully!
        </div>
      )}
    </div>
  );
};

export default TrainingProgress;
