"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import * as z from "zod";
import { Loader2, ArrowLeft, Wand2, Save, CheckCircle, Download, BarChart3, Sparkles, X, ChevronRight, BrainCircuit, Briefcase, Target } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "../../lib/supabase";
import ExecutiveTemplate from "../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../components/templates/CreativeTemplate";

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
    includeProjects: z.boolean().default(true).optional(),
    includeCertifications: z.boolean().default(true).optional(),
    includeAchievements: z.boolean().default(true).optional(),
    includeLanguages: z.boolean().default(true).optional(),
    includeHobbies: z.boolean().default(true).optional(),
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
    const analysisRef = useRef<HTMLDivElement>(null);
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
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState<"pdf" | "png" | "jpg" | null>(null);
    const [hobbies, setHobbies] = useState("");
    const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);
    const [showEnhanceModal, setShowEnhanceModal] = useState(false);
    const [enhanceOption, setEnhanceOption] = useState<"dreamJob" | "normal" | null>(null);
    const [dreamJobInput, setDreamJobInput] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        control,
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
                    if (parsed.hobbies) setHobbies(parsed.hobbies);
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
                localStorage.setItem("resumeFormData", JSON.stringify({ ...value, hobbies }));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, hobbies]);

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
                body: JSON.stringify({ ...data, hobbies }),
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
                    hobbies,
                    title: `${data.fullName} Resume`,
                    generatedMarkdown: result.markdown,
                }),
            });

            if (saveResponse.ok) {
                const resData = await saveResponse.json();
                if (resData.data && resData.data.length > 0) {
                    setGeneratedSlug(resData.data[0].slug);
                }
                setSavedSuccess(true);
            } else {
                console.error("Failed to save to database");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
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
                body: JSON.stringify({ ...currentValues, hobbies }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze resume");
            }

            const result = await response.json();
            setAnalysisResult(result.analysis);

            setTimeout(() => {
                analysisRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis");
        } finally {
            setIsAnalyzing(false);
            setLoadingType(null);
        }
    };

    const enhanceContent = async (jobRole?: string) => {
        setShowEnhanceModal(false);
        setIsEnhancing(true);
        setLoadingType("enhance");
        setError(null);

        try {
            const currentValues = getValues();
            const response = await fetch("/api/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...currentValues, hobbies, dreamJob: jobRole }),
            });

            if (!response.ok) {
                throw new Error("Failed to enhance content");
            }

            const result = await response.json();
            setEnhancedData(result.enhancedData);
            setShowComparison(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred during enhancement");
        } finally {
            setIsEnhancing(false);
            setLoadingType(null);
        }
    };

    const applyEnhancedVersion = () => {
        if (enhancedData) {
            const currentValues = getValues();
            // Optional: If enhancedData contains hobbies, update it via setHobbies
            // if (enhancedData.hobbies !== undefined) setHobbies(enhancedData.hobbies);
            reset({ ...currentValues, ...enhancedData });
            setShowComparison(false);
            setEnhancedData(null);
        }
    };

    const generateSummary = async () => {
        setIsGeneratingSummary(true);
        setError(null);
        try {
            const currentValues = getValues();
            const response = await fetch("/api/generate-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: currentValues.fullName,
                    skills: currentValues.skills,
                    experience: currentValues.experience,
                    education: currentValues.education,
                    projects: currentValues.projects
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate summary");
            }

            const data = await response.json();
            if (data.summary) {
                setValue("summary", data.summary, { shouldValidate: true });
            }
        } catch (err: unknown) {
            console.error("Error generating summary:", err);
            setError(err instanceof Error ? err.message : "Failed to generate summary");
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleDownload = async (format: "pdf" | "png" | "jpg") => {
        if (!generatedMarkdown) return;

        setIsDownloading(true);
        setDownloadFormat(format);
        try {
            // Dynamically import libraries to avoid SSR issues
            const html2canvas = (await import("html2canvas")).default;

            const element = document.getElementById("resume-export");
            if (!element) return;

            // Optional styling adjustments for standardizing print width temporarily
            const originalWidth = element.style.width;
            const originalMaxWidth = element.style.maxWidth;
            element.style.width = "800px";
            element.style.maxWidth = "800px";

            // Small delay to ensure browser renders the style change
            await new Promise(resolve => setTimeout(resolve, 100));

            let bgColor = "#0a0a0a";
            if (template === "minimal") bgColor = "#ffffff";
            else if (template === "professional") bgColor = "#0f172a";
            else if (template === "executive") bgColor = "#0a1128";
            else if (template === "creative") bgColor = "#1e1b4b";

            // Generate Canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: bgColor,
                useCORS: true,
                logging: false,
            });

            // Revert styles safely
            element.style.width = originalWidth;
            element.style.maxWidth = originalMaxWidth;

            const currentValues = getValues();
            const userName = currentValues.fullName ? currentValues.fullName.replace(/\s+/g, '-').toLowerCase() : 'user';

            if (format === "pdf") {
                const { jsPDF } = await import("jspdf");
                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                const pdfWidth = 210;
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const pdf = new jsPDF({
                    orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
                    unit: 'mm',
                    format: [pdfWidth, pdfHeight]
                });
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`resume-${userName}.pdf`);
            } else {
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                const extension = format === 'png' ? 'png' : 'jpg';
                const imgData = canvas.toDataURL(mimeType, 1.0);
                
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `resume-${userName}.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error(`Failed to generate ${format}:`, error);
        } finally {
            setIsDownloading(false);
            setDownloadFormat(null);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                    <Loader2 className="relative w-10 h-10 text-purple-400 animate-spin mb-4" />
                </div>
                <p className="text-neutral-400 font-medium tracking-wide">Verifying authorization...</p>
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

            {/* Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 border-r border-white/5 bg-black/40 backdrop-blur-xl h-screen overflow-y-auto custom-scrollbar relative z-10">
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
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                                placeholder="John Doe"
                            />
                            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Email Address</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Phone</label>
                        <div className="
                            [&_.react-international-phone-input-container]:flex 
                            [&_.react-international-phone-input-container]:w-full
                            [&_.react-international-phone-country-selector-button]:!bg-black/40 
                            [&_.react-international-phone-country-selector-button]:!border-white/10 
                            [&_.react-international-phone-country-selector-button]:!rounded-l-xl
                            [&_.react-international-phone-country-selector-button]:!h-12
                            [&_.react-international-phone-country-selector-button]:!px-3
                            hover:[&_.react-international-phone-country-selector-button]:!border-purple-500/30
                            [&_.react-international-phone-input]:!bg-black/40 
                            [&_.react-international-phone-input]:!border-white/10 
                            [&_.react-international-phone-input]:!rounded-r-xl
                            [&_.react-international-phone-input]:!h-12
                            [&_.react-international-phone-input]:!px-4
                            [&_.react-international-phone-input]:!text-white
                            [&_.react-international-phone-input]:!w-full
                            hover:[&_.react-international-phone-input]:!border-purple-500/30
                            focus:[&_.react-international-phone-input]:!ring-2 focus:[&_.react-international-phone-input]:!ring-purple-500/50
                            [&_.react-international-phone-country-selector-dropdown]:!bg-neutral-900
                            [&_.react-international-phone-country-selector-dropdown]:!border-white/10
                            [&_.react-international-phone-country-selector-dropdown]:!text-white
                            [&_.react-international-phone-country-selector-dropdown]:!shadow-2xl
                            [&_.react-international-phone-country-selector-dropdown-item]:!text-neutral-300
                            [&_.react-international-phone-country-selector-dropdown-item]:!bg-neutral-900
                            hover:[&_.react-international-phone-country-selector-dropdown-item]:!bg-neutral-800
                        ">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        defaultCountry="in"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2 relative">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-300">Professional Summary</label>
                            {(!watch("summary") || watch("summary").trim() === "") && (
                                <button
                                    type="button"
                                    onClick={generateSummary}
                                    disabled={isGeneratingSummary || isGenerating || isAnalyzing || isEnhancing}
                                    className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingSummary ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <span>✨</span>
                                    )}
                                    {isGeneratingSummary ? "Generating..." : "Generate with AI"}
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <textarea
                                {...register("summary")}
                                rows={3}
                                className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${isGeneratingSummary ? 'opacity-50' : ''}`}
                                placeholder="Experienced Software Engineer with a passion for building scalable web applications..."
                                disabled={isGeneratingSummary}
                            />
                            {isGeneratingSummary && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl backdrop-blur-[1px]">
                                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                                </div>
                            )}
                        </div>
                        {errors.summary && <p className="text-red-400 text-xs mt-1">{errors.summary.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Skills (Comma separated)</label>
                        <textarea
                            {...register("skills")}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                            placeholder="React, Next.js, TypeScript, Node.js..."
                        />
                        {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Experience</label>
                        <textarea
                            {...register("experience")}
                            rows={4}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                            placeholder="Software Engineer at Tech Corp (2020-Present). Built cool things..."
                        />
                        {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Education</label>
                        <textarea
                            {...register("education")}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                            placeholder="B.Sc. Computer Science - University of Awesome (2016-2020)"
                        />
                        {errors.education && <p className="text-red-400 text-xs mt-1">{errors.education.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-300">Projects (Optional)</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-neutral-400 font-medium">Include Section</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register("includeProjects")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                </div>
                            </label>
                        </div>
                        <textarea
                            {...register("projects", {
                                onChange: (e) => setValue("includeProjects", e.target.value.length > 0),
                                onBlur: (e) => {
                                    if (e.target.value.trim() === "") setValue("includeProjects", false);
                                }
                            })}
                            onFocus={() => setValue("includeProjects", true)}
                            rows={3}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${!watch("includeProjects") ? 'opacity-50' : ''}`}
                            placeholder="Personal Portfolio, Open Source Contributions..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-300">Certifications (Optional, comma separated)</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-neutral-400 font-medium">Include Section</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register("includeCertifications")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                </div>
                            </label>
                        </div>
                        <input
                            {...register("certifications", {
                                onChange: (e) => setValue("includeCertifications", e.target.value.length > 0),
                                onBlur: (e) => {
                                    if (e.target.value.trim() === "") setValue("includeCertifications", false);
                                }
                            })}
                            onFocus={() => setValue("includeCertifications", true)}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${!watch("includeCertifications") ? 'opacity-50' : ''}`}
                            placeholder="AWS Certified Solutions Architect, Google Cloud Professional..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-300">Achievements (Optional)</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-neutral-400 font-medium">Include Section</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register("includeAchievements")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                </div>
                            </label>
                        </div>
                        <textarea
                            {...register("achievements", {
                                onChange: (e) => setValue("includeAchievements", e.target.value.length > 0),
                                onBlur: (e) => {
                                    if (e.target.value.trim() === "") setValue("includeAchievements", false);
                                }
                            })}
                            onFocus={() => setValue("includeAchievements", true)}
                            rows={3}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${!watch("includeAchievements") ? 'opacity-50' : ''}`}
                            placeholder="Reduced server costs by 30%, Led a team of 5 developers..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-300">Languages (Optional, comma separated)</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-neutral-400 font-medium">Include Section</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register("includeLanguages")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                </div>
                            </label>
                        </div>
                        <input
                            {...register("languages", {
                                onChange: (e) => setValue("includeLanguages", e.target.value.length > 0),
                                onBlur: (e) => {
                                    if (e.target.value.trim() === "") setValue("includeLanguages", false);
                                }
                            })}
                            onFocus={() => setValue("includeLanguages", true)}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${!watch("includeLanguages") ? 'opacity-50' : ''}`}
                            placeholder="English (Native), Spanish (Fluent), French (Basic)..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-300">Hobbies (Optional, comma separated)</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-neutral-400 font-medium">Include Section</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register("includeHobbies")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                </div>
                            </label>
                        </div>
                        <input
                            value={hobbies}
                            onChange={(e) => {
                                setHobbies(e.target.value);
                                setValue("includeHobbies", e.target.value.length > 0);
                            }}
                            onFocus={() => setValue("includeHobbies", true)}
                            onBlur={(e) => {
                                if (e.target.value.trim() === "") setValue("includeHobbies", false);
                            }}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${!watch("includeHobbies") ? 'opacity-50' : ''}`}
                            placeholder="Reading, Traveling, Photography..."
                        />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">GitHub URL</label>
                            <input
                                {...register("github")}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                                placeholder="github.com/johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">LinkedIn URL</label>
                            <input
                                {...register("linkedin")}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                                placeholder="linkedin.com/in/johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Portfolio URL</label>
                            <input
                                {...register("portfolio")}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:border-purple-500/30 transition-all text-white placeholder:text-neutral-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
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
                            onClick={() => {
                                setEnhanceOption(null);
                                setDreamJobInput("");
                                setShowEnhanceModal(true);
                            }}
                            disabled={isEnhancing || isGenerating || isAnalyzing}
                            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.7)] flex justify-center items-center gap-2 border border-white/10 relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0" />
                            <div className="relative z-10 flex items-center gap-2">
                            {isEnhancing ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    <span>Enhancing Content...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    <span>Auto Enhance with AI</span>
                                </>
                            )}
                            </div>
                        </button>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={isGenerating || isAnalyzing || isEnhancing}
                                className="flex-[2] py-4 px-6 bg-gradient-to-r from-white to-neutral-200 text-black hover:from-neutral-200 hover:to-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all duration-300 shadow-[0_0_30px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.6)] flex justify-center items-center gap-2 border border-white/20 relative overflow-hidden group/gen"
                            >
                                <div className="absolute inset-0 bg-black/5 translate-y-full group-hover/gen:translate-y-0 transition-transform duration-300 ease-out z-0" />
                                <div className="relative z-10 flex items-center gap-2">
                                {isGenerating ? (
                                    <>
                                        <Wand2 className="w-5 h-5 animate-pulse" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 group-hover/gen:rotate-12 transition-transform" />
                                        Generate Resume
                                    </>
                                )}
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={analyzeResume}
                                disabled={isAnalyzing || isGenerating || isEnhancing}
                                className="flex-1 py-4 px-6 bg-black/40 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300 border border-white/10 hover:border-indigo-500/50 flex justify-center items-center gap-2 relative overflow-hidden group/analyze shadow-inner"
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
            <div className="w-full md:w-1/2 bg-black/20 backdrop-blur-md relative h-screen overflow-y-auto custom-scrollbar flex flex-col border-l border-white/5">
                <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/5 p-4 z-10 flex justify-between items-center px-8 shadow-xl">
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
                        {generatedSlug && (
                            <Link href={`/interview-questions/${generatedSlug}`}>
                                <button className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full transition-colors border border-indigo-500/20 flex items-center gap-1.5 font-medium">
                                    <BrainCircuit className="w-3 h-3" />
                                    Interview Questions
                                </button>
                            </Link>
                        )}
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
                            <motion.div
                                key="download-btns"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/5 shadow-inner"
                            >
                                <button
                                    onClick={() => handleDownload("pdf")}
                                    disabled={isDownloading}
                                    className="flex items-center gap-1.5 text-white text-xs font-medium hover:bg-indigo-600/50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                                >
                                    {isDownloading && downloadFormat === "pdf" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                    PDF
                                </button>
                                <button
                                    onClick={() => handleDownload("png")}
                                    disabled={isDownloading}
                                    className="flex items-center gap-1.5 text-white text-xs font-medium hover:bg-emerald-600/50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                                >
                                    {isDownloading && downloadFormat === "png" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                    PNG
                                </button>
                                <button
                                    onClick={() => handleDownload("jpg")}
                                    disabled={isDownloading}
                                    className="flex items-center gap-1.5 text-white text-xs font-medium hover:bg-purple-600/50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                                >
                                    {isDownloading && downloadFormat === "jpg" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                    JPG
                                </button>
                            </motion.div>
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
                                        ref={analysisRef}
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

            {/* Enhance Modal */}
            <AnimatePresence>
                {showEnhanceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                    <Sparkles className="w-6 h-6 text-indigo-400" />
                                    AI Enhancement
                                </h2>
                                <button
                                    onClick={() => setShowEnhanceModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                            
                            <p className="text-neutral-400 text-sm mb-6">
                                Choose how you want AI to improve your professional summary, skills, and projects.
                            </p>

                            <div className="space-y-4">
                                {/* Option 1: Dream Job */}
                                <div 
                                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                        enhanceOption === "dreamJob" 
                                            ? "bg-indigo-500/10 border-indigo-500/50" 
                                            : "bg-black/40 border-white/5 hover:border-white/20"
                                    }`}
                                    onClick={() => setEnhanceOption("dreamJob")}
                                >
                                    <div className="flex items-center gap-3 font-bold text-white mb-1">
                                        <Briefcase className="w-5 h-5 text-indigo-400" />
                                        Enhance based on Dream Job
                                    </div>
                                    <p className="text-xs text-neutral-400 pl-8">
                                        Optimize your resume specifically for a targeted role.
                                    </p>
                                    
                                    {/* Expandable Input for Option 1 */}
                                    <AnimatePresence>
                                        {enhanceOption === "dreamJob" && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                className="overflow-hidden pl-8"
                                            >
                                                <label className="text-xs font-bold text-neutral-300 mb-2 block">What is your dream job?</label>
                                                <input
                                                    type="text"
                                                    value={dreamJobInput}
                                                    onChange={(e) => setDreamJobInput(e.target.value)}
                                                    placeholder="Software Engineer, Data Analyst..."
                                                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-neutral-600 mb-3"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (dreamJobInput.trim() !== "") {
                                                            enhanceContent(dreamJobInput.trim());
                                                        }
                                                    }}
                                                    disabled={dreamJobInput.trim() === ""}
                                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-sm font-bold rounded-lg transition-all"
                                                >
                                                    Enhance For This Job
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Option 2: Normal Enhancement */}
                                <div 
                                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                        enhanceOption === "normal" 
                                            ? "bg-indigo-500/10 border-indigo-500/50" 
                                            : "bg-black/40 border-white/5 hover:border-white/20"
                                    }`}
                                    onClick={() => {
                                        setEnhanceOption("normal");
                                        enhanceContent();
                                    }}
                                >
                                    <div className="flex items-center gap-3 font-bold text-white mb-1">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        Normal AI Enhancement
                                    </div>
                                    <p className="text-xs text-neutral-400 pl-8">
                                        Improve wording and professionalism generically.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
