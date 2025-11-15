"use client";

import { Separator } from "@/components/ui/separator";
import { Award, Trophy, Star, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-primary/20 from-muted/30 via-muted/50 to-muted/70 relative overflow-hidden border-t-2 bg-linear-to-b px-4 py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="bg-primary/20 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/20 absolute -right-20 -bottom-20 h-64 w-64 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h3 className="text-xl font-bold">카러플 군 계산기</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              카트라이더 러쉬 플러스 실력 측정 서비스
            </p>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-muted hover:bg-primary/20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
              >
                <Award className="h-4 w-4" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-muted hover:bg-primary/20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
              >
                <Trophy className="h-4 w-4" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-muted hover:bg-primary/20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
              >
                <Star className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/measure"
                  className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  군 측정하기
                </Link>
              </li>
              <li>
                <Link
                  href="/records"
                  className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  기록표 보기
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link
                  href="/statistics"
                  className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  통계
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Information */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  서비스 소개
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  군 시스템
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  FAQ
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  업데이트 내역
                </button>
              </li>
            </ul>
          </motion.div> */}

          {/* Support */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  문의하기
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  버그 리포트
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  개인정보처리방침
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary group flex items-center gap-2 transition-colors">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  이용약관
                </button>
              </li>
            </ul>
          </motion.div> */}
        </div>

        {/* Divider */}
        <Separator className="bg-primary/20 mb-8" />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <p className="text-muted-foreground text-sm">
            © 2025 카러플 군 계산기. All rights reserved.
          </p>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>Made with 앵두새</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="text-primary h-4 w-4" />
            </motion.div>
            <span>for KartRider</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
