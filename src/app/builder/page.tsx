"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Wand2, Save, CheckCircle, Download, BarChart3, Sparkles, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "../../lib/supabase";
import ExecutiveTemplate from "../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../components/templates/CreativeTemplate";

const templateStyles = {
    modern: "prose prose-invert max-w-none font-sans bg-[#171717] p-8 md:p-12 rounded-3xl border border-[#ffffff0d] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] [&>h1]:text-4xl [&>h1]:font-black [&>h1]:text-transparent [&>h1]:bg-clip-text [&>h1]:bg-gradient-to-r [&>h1]:from-[#818cf8] [&>h1]:to-[#22d3ee] [&>h1]:mb-2 [&>h1+p]:text-[#a3a3a3] [&>h1+p]:text-sm [&>h1+p]:font-medium [&>h1+p]:text-center [&>h1+p]:mb-8 [&>h2]:text-[#818cf8] [&>h2]:bg-[#6366f11a] [&>h2]:px-5 [&>h2]:py-2 [&>h2]:rounded-xl [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:font-bold [&>h2]:border-l-4 [&>h2]:border-[#6366f1] [&>h3]:text-[#ffffff] [&>h3]:font-semibold [&>h3]:text-lg [&>h3]:mt-4 [&>ul]:bg-[#ffffff0d] [&>ul]:p-4 [&>ul]:rounded-2xl [&>ul]:mt-3 [&>ul]:shadow-inner [&>ul>li]:marker:text-[#6366f1] [&>ul>li]:mb-1 [&>p]:text-[#d4d4d4] [&>hr]:border-[#ffffff0d]",
    minimal: "prose prose-invert max-w-none font-sans bg-[#0a0a0a] p-8 md:p-12 [&>h1]:text-3xl [&>h1]:font-light [&>h1]:text-[#ffffff] [&>h1]:mb-1 [&>h1+p]:text-[#a3a3a3] [&>h1+p]:text-xs [&>h1+p]:mb-10 [&>h1+p]:text-center [&>h2]:text-base [&>h2]:font-medium [&>h2]:text-[#ffffff] [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:border-b [&>h2]:border-[#40404080] [&>h2]:pb-1 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:text-[#e5e5e5] [&>h3]:mt-4 [&>p]:text-[#a3a3a3] [&>ul]:pl-5 [&>li]:text-[#a3a3a3] [&>li]:marker:text-[#525252] [&>li]:mb-1 [&>hr]:border-[#262626]",
    professional: "prose prose-invert max-w-none font-serif bg-[#0f172a] p-8 md:p-14 rounded-sm border border-[#334155] shadow-xl [&>h1]:text-4xl [&>h1]:font-serif [&>h1]:text-center [&>h1]:text-[#f1f5f9] [&>h1]:mb-2 [&>h1+p]:text-center [&>h1+p]:text-[#94a3b8] [&>h1+p]:text-sm [&>h1+p]:mb-8 [&>h1+p]:border-b [&>h1+p]:border-[#334155] [&>h1+p]:pb-6 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-[#f1f5f9] [&>h2]:border-b-2 [&>h2]:border-[#475569] [&>h2]:pb-1 [&>h2]:mt-6 [&>h2]:mb-4 [&>h2]:uppercase [&>h2]:tracking-widest [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-[#e2e8f0] [&>h3]:mt-4 [&>p]:text-[#cbd5e1] [&>ul]:pl-8 [&>li]:text-[#cbd5e1] [&>li]:marker:text-[#cbd5e1] [&>li]:mb-1 [&>hr]:border-[#334155]",
};

const formSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    summary: z.string().min(10, "Please provide a professional summary"),
    skills: z.string().min(5, "Please list some skills"),
    experience: z.string().min(10, "Please provide experience details"),
    education: z.string().min(10, "Please provide education details"),
    projects: z.string().optional(),
    certifications: z.string().optional(),
    achievements: z.string().optional(),
    languages: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LoadingView = ({ type }: { type: "generate" | "analyze" | "enhance" | null }) => {
    if (!type) return null;
    return (
        <div className="h-full flex flex-col items-center justify-center text-neutral-500 pb-20 w-full mt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6"
            >
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-2 border-l-2 border-violet-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    {type === "generate" && <Wand2 className="w-8 h-8 text-indigo-400 animate-pulse" />}
                    {type === "analyze" && <BarChart3 className="w-8 h-8 text-indigo-400 animate-pulse" />}
                    {type === "enhance" && <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />}
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                        {type === "generate" && "AI is generating your resume..."}
                        {type === "analyze" && "AI is analyzing ATS compatibility..."}
                        {type === "enhance" && "AI is improving your resume..."}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                        {type === "generate" && "Creating a professional resume from your details"}
                        {type === "analyze" && "Checking keywords, formatting and ATS score"}
                        {type === "enhance" && "Enhancing wording and making it more professional"}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default function BuilderPage() {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [template, setTemplate] = useState("modern");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancedData, setEnhancedData] = useState<Partial<FormValues> | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [loadingType, setLoadingType] = useState<"generate" | "analyze" | "enhance" | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        getValues,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();

        const savedTemplate = localStorage.getItem("resumeTemplate");
        if (savedTemplate) {
            setTemplate(savedTemplate);
        }

        const savedFormData = localStorage.getItem("resumeFormData");
        if (savedFormData) {
            try {
                const parsed = JSON.parse(savedFormData);
                if (Object.keys(parsed).length > 0) {
                    reset(parsed);
                }
            } catch (e) { }
        }

        const savedMarkdown = localStorage.getItem("resumeGeneratedContent");
        if (savedMarkdown) {
            setGeneratedMarkdown(savedMarkdown);
        }

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router, reset]);

    useEffect(() => {
        const subscription = watch((value) => {
            if (value && Object.keys(value).length > 0) {
                localStorage.setItem("resumeFormData", JSON.stringify(value));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (generatedMarkdown !== null) {
            localStorage.setItem("resumeGeneratedContent", generatedMarkdown);
        }
    }, [generatedMarkdown]);

    const onSubmit = async (data: FormValues) => {
        setIsGenerating(true);
        setLoadingType("generate");
        setError(null);
        setSavedSuccess(false);
        setGeneratedMarkdown(null);

        try {
            // 1. Generate via OpenRouter
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to generate resume");
            }

            const result = await response.json();
            setGeneratedMarkdown(result.markdown);

            // 2. Save to Supabase (in background or await)
            setIsSaving(true);
            const saveResponse = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    title: `${data.fullName} Resume`,
                    generatedMarkdown: result.markdown,
                }),
            });

            if (saveResponse.ok) {
                setSavedSuccess(true);
            } else {
                console.error("Failed to save to database");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsGenerating(false);
            setLoadingType(null);
            setIsSaving(false);
        }
    };

    const analyzeResume = async () => {
        setIsAnalyzing(true);
        setLoadingType("analyze");
        setAnalysisResult(null);
        setError(null);

        try {
            const currentValues = getValues();
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentValues),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze resume");
            }

            const result = await response.json();
            setAnalysisResult(result.analysis);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during analysis");
        } finally {
            setIsAnalyzing(false);
            setLoadingType(null);
        }
    };

    const enhanceContent = async () => {
        setIsEnhancing(true);
        setLoadingType("enhance");
        setError(null);

        try {
            const currentValues = getValues();
            const response = await fetch("/api/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentValues),
            });

            if (!response.ok) {
                throw new Error("Failed to enhance content");
            }

            const result = await response.json();
            setEnhancedData(result.enhancedData);
            setShowComparison(true);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during enhancement");
        } finally {
            setIsEnhancing(false);
            setLoadingType(null);
        }
    };

    const applyEnhancedVersion = () => {
        if (enhancedData) {
            const currentValues = getValues();
            reset({ ...currentValues, ...enhancedData });
            setShowComparison(false);
            setEnhancedData(null);
        }
    };

    const handleDownloadPDF = async () => {
        if (!generatedMarkdown) return;

        setIsDownloading(true);
        try {
            // Dynamically import html2pdf to avoid SSR issues with window object
            const html2pdf = (await import("html2pdf.js")).default;

            const element = document.getElementById("resume-export");
            if (!element) return;

            // Clone to avoid modifying the visual DOM while downloading
            const clone = element.cloneNode(true) as HTMLElement;
            // Force text scaling/printing styles for a solid PDF output
            clone.style.padding = "40px";

            let bgColor = "#0a0a0a";
            if (template === "minimal") bgColor = "white";
            else if (template === "professional") bgColor = "#0f172a";
            else if (template === "executive") bgColor = "#0a1128";
            else if (template === "creative") bgColor = "#1e1b4b"; // gradient fallback

            clone.style.backgroundColor = bgColor;
            if (template === "minimal") {
                clone.style.color = "black";
            }

            const currentValues = getValues();
            const userName = currentValues.fullName ? currentValues.fullName.replace(/\s+/g, '-').toLowerCase() : 'user';

            const opt = {
                margin: 10,
                filename: `resume-${userName}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(clone).save();
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-50">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-neutral-400 font-medium">Verifying authorization...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 border-r border-white/10 h-screen overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Dashboard
                        </Link>
                        <span className="text-neutral-600">|</span>
                        <button
                            type="button"
                            onClick={async () => {
                                await supabaseClient.auth.signOut();
                                localStorage.removeItem("resumeFormData");
                                localStorage.removeItem("resumeGeneratedContent");
                                localStorage.removeItem("resumeTemplate");
                                router.push('/login');
                            }}
                            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Build Your Resume</h1>
                    <p className="text-neutral-400">Enter your details and let AI do the heavy lifting.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Full Name</label>
                            <input
                                {...register("fullName")}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                                placeholder="John Doe"
                            />
                            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Email Address</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Phone</label>
                        <input
                            {...register("phone")}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                            placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Professional Summary</label>
                        <textarea
                            {...register("summary")}
                            rows={3}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600 resize-none"
                            placeholder="Experienced Software Engineer with a passion for building scalable web applications..."
                        />
                        {errors.summary && <p className="text-red-400 text-xs mt-1">{errors.summary.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Skills (Comma separated)</label>
                        <textarea
                            {...register("skills")}
                            rows={3}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600 resize-none"
                            placeholder="React, Next.js, TypeScript, Node.js..."
                        />
                        {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Experience</label>
                        <textarea
                            {...register("experience")}
                            rows={4}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600 resize-none"
                            placeholder="Software Engineer at Tech Corp (2020-Present). Built cool things..."
                        />
                        {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Education</label>
                        <textarea
                            {...register("education")}
                            rows={3}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600 resize-none"
                            placeholder="B.Sc. Computer Science - University of Awesome (2016-2020)"
                        />
                        {errors.education && <p className="text-red-400 text-xs mt-1">{errors.education.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Projects (Optional)</label>
                        <textarea
                            {...register("projects")}
                            rows={3}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600 resize-none"
                            placeholder="Personal Portfolio, Open Source Contributions..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Certifications (Optional, comma separated)</label>
                        <input
                            {...register("certifications")}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                            placeholder="AWS Certified Solutions Architect, Google Cloud Professional..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Achievements (Optional)</label>
                        <textarea
                            {...register("achievements")}
                            rows={3}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600 resize-none"
                            placeholder="Reduced server costs by 30%, Led a team of 5 developers..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Languages (Optional, comma separated)</label>
                        <input
                            {...register("languages")}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                            placeholder="English (Native), Spanish (Fluent), French (Basic)..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">GitHub URL</label>
                            <input
                                {...register("github")}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                                placeholder="github.com/johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">LinkedIn URL</label>
                            <input
                                {...register("linkedin")}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                                placeholder="linkedin.com/in/johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Portfolio URL</label>
                            <input
                                {...register("portfolio")}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-neutral-600"
                                placeholder="johndoe.com"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 pt-6">
                        <button
                            type="button"
                            onClick={enhanceContent}
                            disabled={isEnhancing || isGenerating || isAnalyzing}
                            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] flex justify-center items-center gap-2 border border-white/10"
                        >
                            {isEnhancing ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    <span>Enhancing Content...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Auto Enhance with AI</span>
                                </>
                            )}
                        </button>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={isGenerating || isAnalyzing || isEnhancing}
                                className="flex-[2] py-4 px-6 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] flex justify-center items-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Wand2 className="w-5 h-5 animate-pulse" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        Generate Resume
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={analyzeResume}
                                disabled={isAnalyzing || isGenerating || isEnhancing}
                                className="flex-1 py-4 px-6 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all border border-white/5 flex justify-center items-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <BarChart3 className="w-5 h-5 text-indigo-400 animate-pulse" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                                        <span>Analyze ATS</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Preview Section */}
            <div className="w-full md:w-1/2 bg-neutral-900 relative h-screen overflow-y-auto custom-scrollbar flex flex-col">
                <div className="sticky top-0 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5 p-4 z-10 flex justify-between items-center px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="font-medium text-neutral-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Live Preview
                        </h2>
                        <Link href="/templates">
                            <button className="text-xs bg-white/5 hover:bg-white/10 text-neutral-400 px-3 py-1.5 rounded-full transition-colors border border-white/5">
                                Change Template
                            </button>
                        </Link>
                    </div>

                    <AnimatePresence>
                        {savedSuccess && (
                            <motion.div
                                key="saved-success-toast"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Saved to DB
                            </motion.div>
                        )}
                        {isSaving && (
                            <motion.div
                                key="saving-toast"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium bg-white/5 px-3 py-1.5 rounded-full"
                            >
                                <Save className="w-4 h-4 animate-pulse" />
                                Saving...
                            </motion.div>
                        )}
                        {generatedMarkdown && !isSaving && (
                            <motion.button
                                key="download-btn"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="flex items-center gap-2 text-white text-sm font-medium bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
                            >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isDownloading ? "Generating PDF..." : "Download PDF"}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-8 lg:p-12 flex-1 flex flex-col items-center custom-scrollbar overflow-y-auto h-screen">
                    {(isGenerating || isAnalyzing || isEnhancing) ? (
                        <LoadingView type={loadingType} />
                    ) : generatedMarkdown ? (
                        <div className="w-full max-w-[800px] space-y-12">
                            <div id="resume-export" className="bg-transparent h-fit w-full">
                                {template === "executive" ? (
                                    <ExecutiveTemplate markdown={generatedMarkdown} />
                                ) : template === "creative" ? (
                                    <CreativeTemplate markdown={generatedMarkdown} />
                                ) : (
                                    <motion.div
                                        id="resume-preview-content"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={templateStyles[template as keyof typeof templateStyles] || templateStyles.modern}
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedMarkdown}</ReactMarkdown>
                                    </motion.div>
                                )}
                            </div>

                            {/* Analysis Panel */}
                            <AnimatePresence>
                                {analysisResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="w-full bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                <BarChart3 className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold">ATS Analysis Results</h2>
                                        </div>
                                        <div className="prose prose-invert max-w-none prose-p:text-neutral-400 prose-li:text-neutral-400 prose-headings:text-white prose-strong:text-indigo-400 border-t border-white/5 pt-6">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 pb-20">
                            <div className="w-24 h-24 mb-6 rounded-3xl bg-neutral-800/50 flex items-center justify-center border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
                                <Wand2 className="w-10 h-10 text-neutral-600" />
                            </div>
                            <p className="text-lg font-medium text-neutral-400 mb-2">Resume Preview</p>
                            <p className="text-sm text-center max-w-xs">Fill out the form on the left to generate your optimized markdown resume here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add some global scrollbar styles inside the layout or just use custom-scrollbar via tailwind css */}
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
            {/* Comparison Modal */}
            <AnimatePresence>
                {showComparison && enhancedData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-indigo-400" />
                                        Review AI Enhancements
                                    </h2>
                                    <p className="text-neutral-400 text-sm mt-1">Compare your original content with the AI-optimized version.</p>
                                </div>
                                <button
                                    onClick={() => setShowComparison(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-neutral-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                                <div className="space-y-12">
                                    {Object.entries(enhancedData).map(([key, enhancedValue]) => {
                                        const originalValue = getValues()[key as keyof FormValues];
                                        if (!originalValue || originalValue === enhancedValue) return null;

                                        return (
                                            <div key={key} className="space-y-4">
                                                <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-wider">{key}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-bold text-neutral-500 uppercase">Original</p>
                                                        <div className="p-4 bg-neutral-800/50 border border-white/5 rounded-2xl text-neutral-400 text-sm italic whitespace-pre-wrap">
                                                            {originalValue as string}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-bold text-indigo-400 uppercase">AI Enhanced</p>
                                                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-white text-sm whitespace-pre-wrap">
                                                            {enhancedValue as string}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-neutral-900/50 flex gap-4">
                                <button
                                    onClick={() => setShowComparison(false)}
                                    className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-all border border-white/5"
                                >
                                    Keep Original
                                </button>
                                <button
                                    onClick={applyEnhancedVersion}
                                    className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Apply AI Enhanced Version
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
