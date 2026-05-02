"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type ScrollSafeDropdownTriggerProps = React.ComponentProps<typeof Button> & {
  setOpen: (open: boolean) => void;
  moveThreshold?: number;
};

export function ScrollSafeDropdownTrigger({
  setOpen,
  moveThreshold = 10,
  onPointerDownCapture,
  onPointerMoveCapture,
  onPointerUpCapture,
  onPointerCancelCapture,
  onClickCapture,
  ...props
}: ScrollSafeDropdownTriggerProps) {
  const touchStateRef = React.useRef<{
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressNextClickRef = React.useRef(false);
  const suppressClickTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (suppressClickTimerRef.current !== null) {
        window.clearTimeout(suppressClickTimerRef.current);
      }
    };
  }, []);

  const suppressNextClick = () => {
    suppressNextClickRef.current = true;

    if (suppressClickTimerRef.current !== null) {
      window.clearTimeout(suppressClickTimerRef.current);
    }

    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressNextClickRef.current = false;
      suppressClickTimerRef.current = null;
    }, 350);
  };

  return (
    <DropdownMenuTrigger asChild>
      <Button
        {...props}
        onPointerDownCapture={(event) => {
          onPointerDownCapture?.(event);
          if (event.defaultPrevented || event.pointerType !== "touch") return;

          touchStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            moved: false,
          };

          event.preventDefault();
          event.stopPropagation();
        }}
        onPointerMoveCapture={(event) => {
          onPointerMoveCapture?.(event);
          const touchState = touchStateRef.current;
          if (!touchState || event.pointerType !== "touch") return;

          const deltaX = event.clientX - touchState.startX;
          const deltaY = event.clientY - touchState.startY;

          if (Math.hypot(deltaX, deltaY) > moveThreshold) {
            touchState.moved = true;
          }
        }}
        onPointerUpCapture={(event) => {
          onPointerUpCapture?.(event);
          const touchState = touchStateRef.current;
          if (!touchState || event.pointerType !== "touch") return;

          event.preventDefault();
          event.stopPropagation();
          suppressNextClick();

          if (!touchState.moved) {
            setOpen(true);
          }

          touchStateRef.current = null;
        }}
        onPointerCancelCapture={(event) => {
          onPointerCancelCapture?.(event);
          touchStateRef.current = null;
          suppressNextClick();
        }}
        onClickCapture={(event) => {
          onClickCapture?.(event);
          if (!suppressNextClickRef.current) return;

          event.preventDefault();
          event.stopPropagation();
        }}
      />
    </DropdownMenuTrigger>
  );
}
