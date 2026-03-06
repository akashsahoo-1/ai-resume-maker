"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, CheckCircle, LayoutTemplate } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tight">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">AI Resume Maker</span>
          </div>
          <Link href="/builder">
            <button className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-full opacity-70 group-hover:opacity-100 animate-spin-[3s_linear_infinite]" />
              <div className="relative bg-black/90 backdrop-blur-md px-6 py-2.5 rounded-full text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                Get Started
              </div>
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-10 shadow-[0_0_30px_rgba(139,92,246,0.15)] backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium tracking-wide">Powered by Advanced AI Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.1]"
          >
            Craft your perfect resume in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">seconds</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-neutral-400 max-w-3xl mb-12 font-light leading-relaxed"
          >
            Stop wrestling with formatting and wording. Let our AI generate a professional, ATS-optimized resume guaranteed to impress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/builder">
              <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.8)] border border-white/10">
                <span className="relative z-10">Build Resume Now</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left relative"
          >
            {/* Cards background glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-purple-500/5 to-transparent blur-2xl rounded-3xl -z-10" />
            
            <FeatureCard 
              icon={<FileText className="w-7 h-7 text-purple-400" />}
              title="ATS-Optimized"
              desc="Our AI generates formatting and keywords specifically designed to comfortably pass Applicant Tracking Systems."
              delay={0.6}
            />
            <FeatureCard 
              icon={<Sparkles className="w-7 h-7 text-fuchsia-400" />}
              title="Smart Phrasing"
              desc="We significantly enhance your experience descriptions with powerful action verbs and quantifiable results."
              delay={0.7}
            />
            <FeatureCard 
              icon={<CheckCircle className="w-7 h-7 text-indigo-400" />}
              title="Instant Preview"
              desc="Watch your professional resume come to life in real-time as the advanced AI meticulously generates it."
              delay={0.8}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-white/5 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      <div className="relative h-full p-8 rounded-[23px] bg-black/40 backdrop-blur-xl border border-white/5 overflow-hidden">
        {/* Glow behind icon */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
        
        <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white/90">{title}</h3>
        <p className="text-neutral-400 leading-relaxed font-light">{desc}</p>
      </div>
    </motion.div>
  );
}
