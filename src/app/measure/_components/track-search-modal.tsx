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
  isEditMode?: boolean;
}

export function TrackSearchModal({
  open,
  onClose,
  maps,
  currentMapIndex,
  onSelectTrack,
  isEditMode,
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
      <div className="relative mt-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="트랙 이름 검색..."
          className="border-primary/20 pl-9"
          autoFocus={false}
        />
      </div>

      {/* Track List */}
      <div
        className={`space-y-2 overflow-y-auto ${isMobile ? "max-h-[270px]" : "max-h-[60vh]"}`}
      >
        <AnimatePresence>
          {filteredMaps.map((map, idx) => {
            const isCurrentTrack = map.originalIndex === currentMapIndex;
            const isPastTrack = map.originalIndex < currentMapIndex;
            // 편집 모드에서는 트랙 이동 불가, 그 외에는 이전/다음 모두 이동 가능
            const isDisabled = isEditMode;

            return (
              <motion.button
                key={map.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleSelectMap(map.originalIndex)}
                disabled={isDisabled}
                className={`group relative w-full rounded-lg border p-3 text-left transition-all ${
                  isCurrentTrack
                    ? "border-primary/50 bg-primary/5"
                    : isDisabled
                      ? "bg-muted/50 border-muted/50 cursor-not-allowed opacity-50"
                      : isPastTrack
                        ? "border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10"
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

                  {/* Completed Badge - 이전 트랙으로 돌아갈 수 있음 */}
                  {isPastTrack && (
                    <div className={`rounded-md px-2 py-1 text-xs font-medium ${
                      isDisabled
                        ? "bg-muted text-muted-foreground"
                        : "bg-amber-500/20 text-amber-600"
                    }`}>
                      {isDisabled ? "완료" : "되돌아가기"}
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
        <div className="from-background via-background/70 pointer-events-none sticky bottom-0 left-0 h-8 w-full bg-linear-to-t to-transparent" />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(isOpen) => !isOpen && onClose()}
        shouldScaleBackground={false}
      >
        <DrawerContent
          className="flex h-[450px]! max-h-[450px]! flex-col"
          style={{
            height: "450px",
            maxHeight: "450px",
          }}
        >
          <DrawerHeader className="shrink-0">
            <DrawerTitle>트랙 검색</DrawerTitle>
            <DrawerDescription>
              트랙 이름을 검색하여 원하는 트랙을 선택할 수 있습니다.
              <br />
              {isEditMode
                ? "수정 모드에서는 트랙 이동이 불가능합니다."
                : "이전 트랙으로 돌아가면 해당 트랙 이후의 기록이 삭제됩니다."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden px-4 pb-4">{content}</div>
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
            {isEditMode
              ? "수정 모드에서는 트랙 이동이 불가능합니다."
              : "이전 트랙으로 돌아가면 해당 트랙 이후의 기록이 삭제됩니다."}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
