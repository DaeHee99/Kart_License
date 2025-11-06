"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageZoomProps {
  children: React.ReactElement;
  images?: string[];
  currentIndex?: number;
}

export function ImageZoom({
  children,
  images = [],
  currentIndex = 0,
}: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [mounted, setMounted] = useState(false);
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(
    null,
  );

  // Ensure we have valid images array
  const validImages = images && images.length > 0 ? images : [];
  const hasMultipleImages = validImages.length > 1;

  // Check if component is mounted (for SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update active index when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
    }
  }, [isOpen, currentIndex]);

  // Lock body scroll when image is zoomed
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore body scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 50; // Minimum drag distance to trigger navigation
    const velocity = Math.abs(info.velocity.x);

    if (!hasMultipleImages) return;

    // If dragged right with enough distance/velocity, go to previous image
    if (info.offset.x > threshold || (info.offset.x > 20 && velocity > 500)) {
      handlePrevious();
      setDragDirection("right");
      setTimeout(() => setDragDirection(null), 300);
    }
    // If dragged left with enough distance/velocity, go to next image
    else if (
      info.offset.x < -threshold ||
      (info.offset.x < -20 && velocity > 500)
    ) {
      handleNext();
      setDragDirection("left");
      setTimeout(() => setDragDirection(null), 300);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={() => setIsOpen(false)}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-[10000] text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Buttons */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-4 z-[10000] -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-4 z-[10000] -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 z-[10000] -translate-x-1/2 transform rounded-full bg-black/70 px-4 py-2 text-sm text-white">
              {activeIndex + 1} / {validImages.length}
            </div>
          )}

          {/* Image */}
          <motion.div
            key={activeIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag={hasMultipleImages ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex h-full w-full cursor-grab items-center justify-center p-4 active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                validImages[activeIndex] ||
                ((children as any).props?.src as string)
              }
              alt={`Image ${activeIndex + 1}`}
              className="pointer-events-none h-auto max-h-full w-auto max-w-full object-contain select-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
