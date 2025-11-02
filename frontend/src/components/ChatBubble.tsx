import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChatBubbleProps {
  type: "sent" | "received";
  children: ReactNode;
  className?: string;
}

const ChatBubble = ({ type, children, className }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "animate-fade-in rounded-2xl px-4 py-3 shadow-md",
        type === "sent" 
          ? "ml-auto bg-chat-sent text-white" 
          : "mr-auto bg-chat-received text-foreground",
        "max-w-[85%] md:max-w-[70%]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ChatBubble;
