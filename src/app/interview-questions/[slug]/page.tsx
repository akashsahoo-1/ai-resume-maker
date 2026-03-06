"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, BrainCircuit, Sparkles, Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import { supabaseClient } from "../../../lib/supabase";
import ExecutiveTemplate from "../../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";

const templateStyles = {
    modern: "max-w-none font-sans bg-[#171717] p-8 md:p-12 rounded-3xl border border-[#ffffff0d] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] [&>h1]:text-4xl [&>h1]:font-black [&>h1]:text-transparent [&>h1]:bg-clip-text [&>h1]:bg-gradient-to-r [&>h1]:from-[#818cf8] [&>h1]:to-[#22d3ee] [&>h1]:mb-2 [&>h1+p]:text-[#a3a3a3] [&>h1+p]:text-sm [&>h1+p]:font-medium [&>h1+p]:text-center [&>h1+p]:mb-8 [&>h2]:text-[#818cf8] [&>h2]:bg-[#6366f11a] [&>h2]:px-5 [&>h2]:py-2 [&>h2]:rounded-xl [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:font-bold [&>h2]:border-l-4 [&>h2]:border-[#6366f1] [&>h3]:text-[#ffffff] [&>h3]:font-semibold [&>h3]:text-lg [&>h3]:mt-4 [&>ul]:bg-[#ffffff0d] [&>ul]:list-disc [&>ul]:p-4 [&>ul]:rounded-2xl [&>ul]:mt-3 [&>ul]:shadow-inner [&>ul>li]:marker:text-[#6366f1] [&>ul>li]:mb-1 [&>p]:text-[#d4d4d4] [&>p]:mb-3 [&>a]:text-[#3b82f6] [&>hr]:border-[#ffffff0d] [&>hr]:my-6",
    minimal: "max-w-none font-sans bg-[#0a0a0a] p-8 md:p-12 [&>h1]:text-3xl [&>h1]:font-light [&>h1]:text-[#ffffff] [&>h1]:mb-1 [&>h1+p]:text-[#a3a3a3] [&>h1+p]:text-xs [&>h1+p]:mb-10 [&>h1+p]:text-center [&>h2]:text-base [&>h2]:font-medium [&>h2]:text-[#ffffff] [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:border-b [&>h2]:border-[#40404080] [&>h2]:pb-1 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:text-[#e5e5e5] [&>h3]:mt-4 [&>p]:text-[#a3a3a3] [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>li]:text-[#a3a3a3] [&>li]:marker:text-[#525252] [&>li]:mb-1 [&>a]:text-[#ffffff] [&>hr]:border-[#262626] [&>hr]:my-6",
    professional: "max-w-none font-serif bg-[#0f172a] p-8 md:p-14 rounded-sm border border-[#334155] shadow-xl [&>h1]:text-4xl [&>h1]:font-serif [&>h1]:text-center [&>h1]:text-[#f1f5f9] [&>h1]:mb-2 [&>h1+p]:text-center [&>h1+p]:text-[#94a3b8] [&>h1+p]:text-sm [&>h1+p]:mb-8 [&>h1+p]:border-b [&>h1+p]:border-[#334155] [&>h1+p]:pb-6 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-[#f1f5f9] [&>h2]:border-b-2 [&>h2]:border-[#475569] [&>h2]:pb-1 [&>h2]:mt-6 [&>h2]:mb-4 [&>h2]:uppercase [&>h2]:tracking-widest [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-[#e2e8f0] [&>h3]:mt-4 [&>p]:text-[#cbd5e1] [&>p]:mb-3 [&>ul]:list-disc [&>ul]:mb-6 [&>ul]:pl-8 [&>li]:text-[#cbd5e1] [&>li]:marker:text-[#cbd5e1] [&>li]:mb-1 [&>a]:text-[#38bdf8] [&>hr]:border-[#334155] [&>hr]:my-6",
    developer: "max-w-none font-mono bg-[#0d1117] p-8 md:p-12 text-[#c9d1d9] [&>h1]:text-4xl [&>h1]:text-[#58a6ff] [&>h1]:mb-2 [&>h1+p]:text-[#8b949e] [&>h1+p]:mb-8 [&>h2]:text-xl [&>h2]:text-[#3fb950] [&>h2]:border-b [&>h2]:border-[#21262d] [&>h2]:pb-2 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:text-[#d2a8ff] [&>h3]:mt-4 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>li]:mb-1 [&>a]:text-[#58a6ff] [&>hr]:border-[#21262d] [&>hr]:my-6",
    elegant: "max-w-none font-serif bg-[#fdfbf7] p-8 md:p-14 text-[#2d3748] [&>h1]:text-4xl [&>h1]:font-light [&>h1]:text-center [&>h1]:text-[#1a202c] [&>h1]:mb-2 [&>h1+p]:text-center [&>h1+p]:text-[#718096] [&>h1+p]:text-sm [&>h1+p]:mb-10 [&>h2]:text-xl [&>h2]:font-medium [&>h2]:text-[#2c5282] [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-center [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-[#2d3748] [&>h3]:mt-4 [&>p]:text-[#4a5568] [&>p]:mb-3 [&>ul]:list-none [&>ul]:p-0 [&>ul]:mb-6 [&>li]:relative [&>li]:pl-4 [&>li]:mb-2 [&>li::before]:content-['•'] [&>li::before]:absolute [&>li::before]:left-0 [&>li::before]:text-[#2c5282] [&>a]:text-[#2b6cb0] [&>hr]:border-[#e2e8f0] [&>hr]:my-6",
    corporate: "max-w-none font-sans bg-white p-8 md:p-12 text-[#1e293b] [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-[#0f172a] [&>h1]:mb-2 [&>h1+p]:text-[#64748b] [&>h1+p]:mb-8 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-[#0f172a] [&>h2]:uppercase [&>h2]:tracking-wider [&>h2]:border-b-2 [&>h2]:border-[#0f172a] [&>h2]:pb-2 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-[#334155] [&>h3]:mt-4 [&>p]:text-[#475569] [&>p]:mb-3 [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-6 [&>li]:text-[#475569] [&>li]:mb-1 [&>li]:flex [&>li::before]:content-['\\2013'] [&>li::before]:mr-2 [&>a]:text-[#0284c7] [&>hr]:border-[#cbd5e1] [&>hr]:my-6",
    tech: "max-w-none font-sans bg-[#0f172a] p-8 md:p-12 border-l-4 border-[#38bdf8] text-[#cbd5e1] [&>h1]:text-4xl [&>h1]:font-black [&>h1]:text-[#f8fafc] [&>h1]:mb-1 [&>h1+p]:text-[#94a3b8] [&>h1+p]:mb-8 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#38bdf8] [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:flex [&>h2]:items-center [&>h2]:gap-2 [&>h2::before]:content-['>_'] [&>h2::before]:text-[#e2e8f0] [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#f1f5f9] [&>h3]:mt-4 [&>p]:mb-3 [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-6 [&>li]:relative [&>li]:pl-6 [&>li]:mb-2 [&>li::before]:content-['\\25B8'] [&>li::before]:absolute [&>li::before]:left-0 [&>li::before]:text-[#38bdf8] [&>a]:text-[#7dd3fc] [&>hr]:border-[#1e293b] [&>hr]:my-6",
    classic: "max-w-none font-serif bg-white p-8 md:p-14 text-black [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-center [&>h1]:mb-1 [&>h1+p]:text-center [&>h1+p]:text-sm [&>h1+p]:mb-8 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-center [&>h2]:uppercase [&>h2]:border-b [&>h2]:border-black [&>h2]:pb-1 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>li]:mb-1 [&>a]:text-black [&>a]:underline [&>hr]:border-black [&>hr]:my-6"
};

export default function InterviewQuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [markdown, setMarkdown] = useState<string | null>(null);
    const [questions, setQuestions] = useState<string | null>(null);
    const [isLoadingResume, setIsLoadingResume] = useState(true);
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [template, setTemplate] = useState("modern");
    
    const [questionOption, setQuestionOption] = useState<"resume" | "jobRole" | null>(null);
    const [jobRoleInput, setJobRoleInput] = useState("");

    useEffect(() => {
        const savedTemplate = localStorage.getItem("resumeTemplate");
        if (savedTemplate) {
            setTemplate(savedTemplate);
        }

        const fetchResume = async () => {
            if (!slug) return;

            setIsLoadingResume(true);
            try {
                const { data, error } = await supabaseClient
                    .from("resumes")
                    .select("generated_markdown")
                    .eq("slug", slug)
                    .single();

                if (error) {
                    throw error;
                }

                if (data && data.generated_markdown) {
                    setMarkdown(data.generated_markdown);
                } else {
                    setError("Resume not found");
                }
            } catch (err: unknown) {
                console.error("Error fetching shared resume:", err);
                setError(err instanceof Error ? err.message : "Failed to load resume");
            } finally {
                setIsLoadingResume(false);
            }
        };

        fetchResume();
    }, [slug]);

    const generateQuestions = async (resumeMarkdown: string, jobRole?: string) => {
        setIsGeneratingQuestions(true);
        setError(null);
        try {
            const response = await fetch("/api/interview-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markdown: resumeMarkdown, jobRole: jobRole }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate questions");
            }

            const result = await response.json();
            if (result.questions) {
                setQuestions(result.questions);
            }
        } catch (err: unknown) {
            console.error("Error generating questions:", err);
            setError(err instanceof Error ? err.message : "Failed to generate interview questions");
        } finally {
            setIsGeneratingQuestions(false);
        }
    };

    if (isLoadingResume) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative z-10">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                <p className="text-neutral-400 font-medium tracking-wide">Loading your resume...</p>
            </div>
        );
    }

    if (error && !markdown) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
                <div className="max-w-md text-center p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.1)]">
                    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-neutral-400 mb-6">{error}</p>
                    <Link href="/builder" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                        Go back to Builder
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative z-10 overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>

            {/* Left Side - Resume Preview */}
            <div className="w-full md:w-1/2 bg-black/20 backdrop-blur-md relative h-screen overflow-y-auto custom-scrollbar border-r border-white/5 flex flex-col">
                <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/5 p-4 z-10 flex items-center shadow-xl">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-neutral-300 font-medium text-sm">Resume Preview</span>
                    </div>
                </div>

                <div className="p-8 lg:p-12 flex-1 flex flex-col items-center">
                    <div className="w-full max-w-[800px] space-y-12">
                        <div className="bg-transparent h-fit w-full">
                            {template === "executive" ? (
                                <ExecutiveTemplate markdown={markdown || ""} />
                            ) : template === "creative" ? (
                                <CreativeTemplate markdown={markdown || ""} />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={templateStyles[template as keyof typeof templateStyles] || templateStyles.modern}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Interview Questions */}
            <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-xl h-screen overflow-y-auto custom-scrollbar relative z-10 p-6 md:p-12 lg:p-16">
                <div className="mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <BrainCircuit className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Interview Prep</h1>
                        <p className="text-neutral-400">AI-generated questions based on your resume</p>
                    </div>
                </div>

                {isGeneratingQuestions ? (
                    <div className="flex flex-col items-center justify-center p-12 mt-20 bg-neutral-900/50 border border-white/5 rounded-3xl">
                        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                            <div className="absolute inset-0 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-2 border-l-2 border-violet-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume...</h3>
                        <p className="text-neutral-400 text-center">We are generating realistic interview questions tailored to your experience and skills.</p>
                    </div>
                ) : questions ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                        
                        <div className="prose prose-invert max-w-none 
                            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-6 prose-ol:marker:text-indigo-400 prose-ol:marker:font-bold prose-ol:marker:text-lg
                            prose-li:text-neutral-300 prose-li:leading-relaxed
                            prose-strong:text-indigo-300 prose-strong:font-semibold
                            prose-p:text-neutral-300
                            prose-headings:text-white"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{questions}</ReactMarkdown>
                        </div>
                        
                        <div className="mt-12 pt-6 border-t border-white/10 flex justify-end">
                            <button 
                                onClick={() => {
                                    setQuestions(null);
                                    setQuestionOption(null);
                                    setJobRoleInput("");
                                }}
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10 flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                Generate More
                            </button>
                        </div>
                    </motion.div>
                ) : error ? (
                    <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-3xl text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button 
                            onClick={() => setError(null)}
                            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/80 border border-white/10 rounded-3xl w-full p-8 shadow-2xl relative overflow-hidden"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-white mb-6">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                            Generate Questions
                        </h2>
                        
                        <p className="text-neutral-400 text-sm mb-6">
                            Choose how you would like AI to generate your interview questions.
                        </p>

                        <div className="space-y-4">
                            {/* Option 1: Resume */}
                            <div 
                                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                    questionOption === "resume" 
                                        ? "bg-indigo-500/10 border-indigo-500/50" 
                                        : "bg-black/40 border-white/5 hover:border-white/20"
                                }`}
                                onClick={() => {
                                    setQuestionOption("resume");
                                    generateQuestions(markdown!);
                                }}
                            >
                                <div className="flex items-center gap-3 font-bold text-white mb-1">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                    Generate questions based on Resume
                                </div>
                                <p className="text-xs text-neutral-400 pl-8">
                                    Create realistic questions based strictly on your resume content.
                                </p>
                            </div>

                            {/* Option 2: Job Role */}
                            <div 
                                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                    questionOption === "jobRole" 
                                        ? "bg-indigo-500/10 border-indigo-500/50" 
                                        : "bg-black/40 border-white/5 hover:border-white/20"
                                }`}
                                onClick={() => setQuestionOption("jobRole")}
                            >
                                <div className="flex items-center gap-3 font-bold text-white mb-1">
                                    <Briefcase className="w-5 h-5 text-indigo-400" />
                                    Generate questions based on Job Role
                                </div>
                                <p className="text-xs text-neutral-400 pl-8">
                                    Tailor questions specifically for your target job position.
                                </p>
                                
                                <AnimatePresence>
                                    {questionOption === "jobRole" && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            className="overflow-hidden pl-8"
                                        >
                                            <label className="text-xs font-bold text-neutral-300 mb-2 block">What job role are you preparing for?</label>
                                            <input
                                                type="text"
                                                value={jobRoleInput}
                                                onChange={(e) => setJobRoleInput(e.target.value)}
                                                placeholder="Software Developer, Data Analyst..."
                                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-neutral-600 mb-3"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (jobRoleInput.trim() !== "") {
                                                        generateQuestions(markdown!, jobRoleInput.trim());
                                                    }
                                                }}
                                                disabled={jobRoleInput.trim() === ""}
                                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-sm font-bold rounded-lg transition-all"
                                            >
                                                Generate Questions
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
      `}} />
        </div>
    );
}
