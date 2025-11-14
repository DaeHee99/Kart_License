"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User as UserIcon } from "lucide-react";

interface UserInfoCardProps {
  user?: {
    name: string;
    image?: string;
  } | null;
  season: number;
  createdAt: string;
}

export function UserInfoCard({ user, season, createdAt }: UserInfoCardProps) {
  const userName = user?.name || "비로그인 유저";
  const userImage = user?.image || "/profile/gyool_dizini.png";

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(createdAt);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      <Card className="border-border/50 bg-card/50 overflow-hidden border py-0 backdrop-blur-sm">
        <div className="flex items-center gap-4 p-4">
          <Avatar className="border-border h-16 w-16 border-2">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-muted">
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{userName}</h3>
              <Badge variant="outline" className="text-xs">
                S{season}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {date} {time}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
