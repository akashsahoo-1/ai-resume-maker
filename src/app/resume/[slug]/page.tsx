"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabaseClient } from "../../../lib/supabase";
import ExecutiveTemplate from "../../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";

const templateStyles = {
    modern: "prose prose-invert max-w-none font-sans bg-[#171717] p-8 md:p-12 rounded-3xl border border-[#ffffff0d] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] [&>h1]:text-4xl [&>h1]:font-black [&>h1]:text-transparent [&>h1]:bg-clip-text [&>h1]:bg-gradient-to-r [&>h1]:from-[#818cf8] [&>h1]:to-[#22d3ee] [&>h1]:mb-2 [&>h1+p]:text-[#a3a3a3] [&>h1+p]:text-sm [&>h1+p]:font-medium [&>h1+p]:text-center [&>h1+p]:mb-8 [&>h2]:text-[#818cf8] [&>h2]:bg-[#6366f11a] [&>h2]:px-5 [&>h2]:py-2 [&>h2]:rounded-xl [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:font-bold [&>h2]:border-l-4 [&>h2]:border-[#6366f1] [&>h3]:text-[#ffffff] [&>h3]:font-semibold [&>h3]:text-lg [&>h3]:mt-4 [&>ul]:bg-[#ffffff0d] [&>ul]:p-4 [&>ul]:rounded-2xl [&>ul]:mt-3 [&>ul]:shadow-inner [&>ul>li]:marker:text-[#6366f1] [&>ul>li]:mb-1 [&>p]:text-[#d4d4d4] [&>hr]:border-[#ffffff0d]",
    minimal: "prose prose-invert max-w-none font-sans bg-[#0a0a0a] p-8 md:p-12 [&>h1]:text-3xl [&>h1]:font-light [&>h1]:text-[#ffffff] [&>h1]:mb-1 [&>h1+p]:text-[#a3a3a3] [&>h1+p]:text-xs [&>h1+p]:mb-10 [&>h1+p]:text-center [&>h2]:text-base [&>h2]:font-medium [&>h2]:text-[#ffffff] [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:border-b [&>h2]:border-[#40404080] [&>h2]:pb-1 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:text-[#e5e5e5] [&>h3]:mt-4 [&>p]:text-[#a3a3a3] [&>ul]:pl-5 [&>li]:text-[#a3a3a3] [&>li]:marker:text-[#525252] [&>li]:mb-1 [&>hr]:border-[#262626]",
    professional: "prose prose-invert max-w-none font-serif bg-[#0f172a] p-8 md:p-14 rounded-sm border border-[#334155] shadow-xl [&>h1]:text-4xl [&>h1]:font-serif [&>h1]:text-center [&>h1]:text-[#f1f5f9] [&>h1]:mb-2 [&>h1+p]:text-center [&>h1+p]:text-[#94a3b8] [&>h1+p]:text-sm [&>h1+p]:mb-8 [&>h1+p]:border-b [&>h1+p]:border-[#334155] [&>h1+p]:pb-6 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-[#f1f5f9] [&>h2]:border-b-2 [&>h2]:border-[#475569] [&>h2]:pb-1 [&>h2]:mt-6 [&>h2]:mb-4 [&>h2]:uppercase [&>h2]:tracking-widest [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-[#e2e8f0] [&>h3]:mt-4 [&>p]:text-[#cbd5e1] [&>ul]:pl-8 [&>li]:text-[#cbd5e1] [&>li]:marker:text-[#cbd5e1] [&>li]:mb-1 [&>hr]:border-[#334155]",
};

export default function ResumeSharePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [markdown, setMarkdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            if (!slug) return;

            setIsLoading(true);
            try {
                // Fetch public resume using slug
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
            } catch (err: any) {
                console.error("Error fetching shared resume:", err);
                setError(err.message || "Failed to load resume");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResume();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-50">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-neutral-400 font-medium">Loading resume...</p>
            </div>
        );
    }

    if (error || !markdown) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-50">
                <div className="max-w-md text-center p-8 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-2">Resume Not Found</h2>
                    <p className="text-neutral-400">The link you followed may be invalid or the resume has been deleted.</p>
                </div>
            </div>
        );
    }

    // Default template rendering logic (we use modern since we do not store the active template in DB yet).
    // In advanced setups we would store the targeted template name in DB as well.
    const template: string = "modern";

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-12 px-6 overflow-y-auto">
            <div className="w-full max-w-[800px] pb-24">
                {template === "executive" ? (
                    <ExecutiveTemplate markdown={markdown} />
                ) : template === "creative" ? (
                    <CreativeTemplate markdown={markdown} />
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
    );
}
