"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, LayoutTemplate, Palette, Briefcase, Building, Sparkles } from "lucide-react";
import { supabaseClient } from "../../lib/supabase";

const templates = [
    {
        id: "modern",
        name: "Modern",
        icon: Palette,
        description: "Clean layout with vibrant indigo accents and contemporary typography.",
        previewStyle: "bg-neutral-900 border-indigo-500/30 font-sans",
    },
    {
        id: "minimal",
        name: "Minimal",
        icon: LayoutTemplate,
        description: "Stripped back, focus on content. Uses monospace-inspired sleek styling.",
        previewStyle: "bg-transparent border-l-4 border-neutral-700 font-mono",
    },
    {
        id: "professional",
        name: "Professional",
        icon: Briefcase,
        description: "Classic serif fonts with structured, formal borders suitable for corporate.",
        previewStyle: "bg-slate-900 border border-slate-700 font-serif",
    },
    {
        id: "executive",
        name: "Executive",
        icon: Building,
        description: "Spacious corporate layout in navy and dark gray with traditional ATS-friendly structure.",
        previewStyle: "bg-[#0a1128] border border-slate-700 font-serif",
    },
    {
        id: "creative",
        name: "Creative",
        icon: Sparkles,
        description: "Modern purple gradient theme with a split layout designed for creative professionals.",
        previewStyle: "bg-gradient-to-br from-[#1e1b4b] to-[#312e81] border border-white/10 font-sans",
    },
];

export default function TemplatesPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string>("modern");
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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

        const saved = localStorage.getItem("resumeTemplate");
        if (saved) {
            setSelected(saved);
        }

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleSelect = (id: string) => {
        setSelected(id);
        localStorage.setItem("resumeTemplate", id);
        router.push("/builder");
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-50">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/builder">
                            <button className="text-sm font-medium bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                                Skip to Builder
                            </button>
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
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose a Template</h1>
                    <p className="text-lg text-neutral-400">Select a design style for your AI-generated resume. You can change this later.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {templates.map((template, index) => {
                        const Icon = template.icon;
                        const isSelected = selected === template.id;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                key={template.id}
                                onClick={() => handleSelect(template.id)}
                                className={`relative group cursor-pointer rounded-3xl p-6 transition-all duration-300 border backdrop-blur-sm shadow-2xl ${isSelected
                                    ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)]"
                                    : "bg-neutral-900/50 border-white/5 hover:border-white/20 hover:bg-neutral-900"
                                    }`}
                            >
                                {/* Selection Indicator */}
                                <div className={`absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-500 text-white" : "bg-neutral-800 text-transparent group-hover:bg-neutral-700"
                                    }`}>
                                    <Check className="w-4 h-4" />
                                </div>

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isSelected ? "bg-indigo-500/20 text-indigo-400" : "bg-neutral-800 text-neutral-400 group-hover:text-white"
                                    }`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold mb-3">{template.name}</h3>
                                <p className="text-neutral-400 text-sm mb-6 h-10">{template.description}</p>

                                {/* Mini Preview Mockup */}
                                <div className={`w-full h-40 rounded-xl border p-4 overflow-hidden relative ${template.previewStyle}`}>
                                    <div className="w-1/2 h-3 bg-current opacity-20 rounded mb-4" />
                                    <div className="w-full h-2 bg-current opacity-10 rounded mb-2" />
                                    <div className="w-5/6 h-2 bg-current opacity-10 rounded mb-6" />

                                    <div className="flex gap-2 mb-2">
                                        <div className="w-1/4 h-2 bg-current opacity-20 rounded" />
                                        <div className="w-1/2 h-2 bg-current opacity-10 rounded" />
                                    </div>
                                    <div className="w-full h-2 bg-current opacity-10 rounded" />

                                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[inherit] to-transparent pointer-events-none" />
                                </div>

                                <button
                                    className={`mt-6 w-full py-3 rounded-xl font-medium transition-all ${isSelected
                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                        : "bg-white/5 text-white group-hover:bg-white/10"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(template.id);
                                    }}
                                >
                                    Use Template
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
