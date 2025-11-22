"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search, Trophy } from "lucide-react";
import { MapRecord } from "@/lib/api/types";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

// Difficulty 뱃지 색상 매핑
const DIFFICULTY_COLORS = {
  루키: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  L3: "bg-green-500/10 text-green-600 border-green-500/30",
  L2: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  L1: "bg-red-500/10 text-red-600 border-red-500/30",
};

interface TrackSearchModalProps {
  open: boolean;
  onClose: () => void;
  maps: (MapRecord & { id: string })[];
  currentMapIndex: number;
  onSelectTrack: (mapIndex: number) => void;
}

export function TrackSearchModal({
  open,
  onClose,
  maps,
  currentMapIndex,
  onSelectTrack,
}: TrackSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const filteredMaps = useMemo(() => {
    return maps
      .map((map, index) => ({ ...map, originalIndex: index }))
      .filter((map) =>
        map.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [maps, searchQuery]);

  const handleSelectMap = (mapIndex: number) => {
    onSelectTrack(mapIndex);
    setSearchQuery("");
    onClose();
  };

  const content = (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="트랙 이름 검색..."
          className="border-primary/20 pl-9"
          autoFocus
        />
      </div>

      {/* Track List */}
      <div className="max-h-[60vh] space-y-2 overflow-y-auto">
        <AnimatePresence>
          {filteredMaps.map((map, idx) => {
            const isCurrentTrack = map.originalIndex === currentMapIndex;
            const isPastTrack = map.originalIndex < currentMapIndex;

            return (
              <motion.button
                key={map.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleSelectMap(map.originalIndex)}
                disabled={isPastTrack}
                className={`group relative w-full rounded-lg border p-3 text-left transition-all ${
                  isCurrentTrack
                    ? "border-primary/50 bg-primary/5"
                    : isPastTrack
                      ? "bg-muted/50 border-muted/50 cursor-not-allowed opacity-50"
                      : "hover:border-primary/30 hover:bg-accent/50 border-primary/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Track Image */}
                  {map.imageUrl ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-sm">
                      <Image
                        src={map.imageUrl}
                        alt={map.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="from-primary/20 to-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br shadow-sm">
                      <Trophy className="text-primary h-5 w-5" />
                    </div>
                  )}

                  {/* Track Info */}
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="font-medium">{map.name}</span>
                    <span className="text-muted-foreground text-xs">
                      <Badge
                        variant="outline"
                        className={`mr-1 text-xs font-semibold ${DIFFICULTY_COLORS[map.difficulty]}`}
                      >
                        {map.difficulty}
                      </Badge>
                      • {map.originalIndex + 1}번째 트랙
                    </span>
                  </div>

                  {/* Current Badge */}
                  {isCurrentTrack && (
                    <div className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium">
                      현재
                    </div>
                  )}

                  {/* Completed Badge */}
                  {isPastTrack && (
                    <div className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium">
                      완료
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* No Results */}
        {filteredMaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center"
          >
            <Search className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>트랙 검색</DrawerTitle>
            <DrawerDescription>
              트랙 이름을 검색하여 원하는 트랙을 선택할 수 있습니다.
              <br />
              완료된 트랙은 선택할 수 없습니다.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>트랙 검색</DialogTitle>
          <DialogDescription>
            트랙 이름을 검색하여 원하는 트랙을 선택할 수 있습니다.
            <br />
            완료된 트랙은 선택할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
