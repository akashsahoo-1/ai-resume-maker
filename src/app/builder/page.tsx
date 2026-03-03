"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Wand2, Save, CheckCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    skills: z.string().min(5, "Please list some skills"),
    education: z.string().min(10, "Please provide education details"),
    experience: z.string().min(10, "Please provide experience details"),
    projects: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BuilderPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setIsGenerating(true);
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
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 border-r border-white/10 h-screen overflow-y-auto custom-scrollbar">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>

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

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] flex justify-center items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Resume...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                Generate Resume
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Preview Section */}
            <div className="w-full md:w-1/2 bg-neutral-900 relative h-screen overflow-y-auto custom-scrollbar flex flex-col">
                <div className="sticky top-0 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5 p-4 z-10 flex justify-between items-center px-8">
                    <h2 className="font-medium text-neutral-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Live Preview
                    </h2>

                    <AnimatePresence>
                        {savedSuccess && (
                            <motion.div
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium bg-white/5 px-3 py-1.5 rounded-full"
                            >
                                <Save className="w-4 h-4 animate-pulse" />
                                Saving...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-8 lg:p-12 flex-1">
                    {generatedMarkdown ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prose prose-invert prose-indigo max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 bg-neutral-950 p-8 rounded-2xl border border-white/5 shadow-2xl"
                        >
                            <ReactMarkdown>{generatedMarkdown}</ReactMarkdown>
                        </motion.div>
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
        </div>
    );
}
