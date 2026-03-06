"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, LayoutTemplate, Palette, Briefcase, Building, Sparkles, Code, Star, FileText, Monitor, ScrollText } from "lucide-react";
import { supabaseClient } from "../../lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ExecutiveTemplate from "../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../components/templates/CreativeTemplate";

const sampleMarkdown = `
# John Doe
john@example.com • +1 (555) 000-0000 • New York, NY

Experienced Software Engineer with a strong background in developing award-winning applications for a diverse clientele. 

## Experience
### Senior Engineer
**Tech Innovators Inc.** | *Jan 2020 - Present*
- Architected a scalable microservices infrastructure serving 1M+ active users.
- Mentored a team of 5 junior developers, improving code quality scores by 40%.

## Education
### B.S. in Computer Science
**State University** | *2013 - 2017*

## Skills
React, Next.js, Node.js, TypeScript, Python, AWS, Docker, GraphQL
`;

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
    },
    {
        id: "developer",
        name: "Developer",
        icon: Code,
        description: "Dark, IDE-inspired theme tailored for software engineers and technical roles.",
    },
    {
        id: "elegant",
        name: "Elegant",
        icon: Star,
        description: "Clean, elegant layout with serif fonts and subtle structuring.",
    },
    {
        id: "corporate",
        name: "Corporate",
        icon: FileText,
        description: "Traditional layout suitable for formal industries and corporate environments.",
    },
    {
        id: "tech",
        name: "Tech",
        icon: Monitor,
        description: "Cyber/techy vibe with neon accents and a modern monospace-accented layout.",
    },
    {
        id: "classic",
        name: "Classic",
        icon: ScrollText,
        description: "Very simple white background, traditional serif styling, timeless.",
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
            <div className="min-h-screen flex flex-col items-center justify-center z-10 relative">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 relative z-10">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
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
                            <button className="text-sm font-medium bg-white/5 border border-white/10 text-white px-4 py-2 rounded-full hover:bg-white/10 hover:border-purple-500/30 transition-all">
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

                <div className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">Choose a Template</h1>
                    <p className="text-lg text-neutral-400 max-w-2xl font-light">Select a design style for your intricately generated resume. You can always change this later in the editor.</p>
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
                                className={`relative group cursor-pointer rounded-3xl p-8 transition-all duration-500 border backdrop-blur-xl shadow-2xl overflow-hidden ${isSelected
                                    ? "bg-black/60 border-purple-500 shadow-[0_0_40px_-5px_rgba(139,92,246,0.3)] scale-[1.02]"
                                    : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5"
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isSelected ? 'opacity-100' : ''}`} />
                                
                                {/* Selection Indicator */}
                                <div className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner border border-white/10 relative z-10 ${isSelected ? "bg-purple-500 border-purple-400 text-white" : "bg-white/5 text-transparent group-hover:bg-white/10"
                                    }`}>
                                    <Check className="w-4 h-4" />
                                </div>

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-inner border border-white/5 relative z-10 ${isSelected ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10"
                                    }`}>
                                    <Icon className="w-8 h-8" />
                                </div>

                                <h3 className="text-2xl font-bold mb-3">{template.name}</h3>
                                <p className="text-neutral-400 text-sm mb-6 h-10">{template.description}</p>

                                {/* Mini Preview Rendering */}
                                <div className="w-full h-56 rounded-xl border border-white/10 overflow-hidden relative pointer-events-none group-hover:border-purple-500/30 transition-colors bg-black/50">
                                    <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25]">
                                        {template.id === "executive" ? (
                                            <ExecutiveTemplate markdown={sampleMarkdown} />
                                        ) : template.id === "creative" ? (
                                            <CreativeTemplate markdown={sampleMarkdown} />
                                        ) : (
                                            <div className={templateStyles[template.id as keyof typeof templateStyles] || templateStyles.modern}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{sampleMarkdown}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
                                </div>

                                <button
                                    className={`mt-6 w-full py-3.5 rounded-xl font-bold transition-all duration-300 relative z-10 overflow-hidden ${isSelected
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-white/10"
                                        : "bg-white/5 text-white/80 group-hover:bg-white/10 group-hover:text-white border border-white/5"
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
