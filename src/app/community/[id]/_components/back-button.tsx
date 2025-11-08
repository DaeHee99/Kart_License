import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onBack: () => void;
}

export function BackButton({ onBack }: BackButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Button variant="ghost" onClick={onBack} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로
      </Button>
    </motion.div>
  );
}
