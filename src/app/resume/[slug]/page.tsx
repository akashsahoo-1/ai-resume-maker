"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Loader2, Download } from "lucide-react";
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

export default function ResumeSharePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [markdown, setMarkdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState<"pdf" | "png" | "jpg" | null>(null);

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
            } catch (err: unknown) {
                console.error("Error fetching shared resume:", err);
                setError(err instanceof Error ? err.message : "Failed to load resume");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResume();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
                <p className="text-neutral-400 font-medium tracking-wide">Loading resume...</p>
            </div>
        );
    }

    if (error || !markdown) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
                <div className="max-w-md text-center p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl font-bold mb-2 relative z-10">Resume Not Found</h2>
                    <p className="text-neutral-400 relative z-10">The link you followed may be invalid or the resume has been deleted.</p>
                </div>
            </div>
        );
    }

    // Default template rendering logic (we use modern since we do not store the active template in DB yet).
    // In advanced setups we would store the targeted template name in DB as well.
    const template: string = "modern";

    const handleDownload = async (format: "pdf" | "png" | "jpg") => {
        if (!markdown) return;

        setIsDownloading(true);
        setDownloadFormat(format);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const element = document.getElementById("resume-export");
            if (!element) return;

            const originalWidth = element.style.width;
            const originalMaxWidth = element.style.maxWidth;
            element.style.width = "800px";
            element.style.maxWidth = "800px";

            await new Promise(resolve => setTimeout(resolve, 100));

            let bgColor = "#0a0a0a";
            if (template === "minimal") bgColor = "#ffffff";
            else if (template === "professional") bgColor = "#0f172a";
            else if (template === "executive") bgColor = "#0a1128";
            else if (template === "creative") bgColor = "#1e1b4b";

            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: bgColor,
                useCORS: true,
                logging: false,
            });

            element.style.width = originalWidth;
            element.style.maxWidth = originalMaxWidth;

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
                pdf.save(`resume-${slug}.pdf`);
            } else {
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                const extension = format === 'png' ? 'png' : 'jpg';
                const imgData = canvas.toDataURL(mimeType, 1.0);
                
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `resume-${slug}.${extension}`;
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

    return (
        <div className="min-h-screen flex flex-col items-center py-12 px-6 overflow-y-auto relative z-10">
            <div className="w-full max-w-[800px] mb-6 flex justify-end">
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-white/5 shadow-inner">
                    <button
                        onClick={() => handleDownload("pdf")}
                        disabled={isDownloading}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:bg-indigo-600/50 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                        {isDownloading && downloadFormat === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        PDF
                    </button>
                    <button
                        onClick={() => handleDownload("png")}
                        disabled={isDownloading}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:bg-emerald-600/50 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                        {isDownloading && downloadFormat === "png" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        PNG
                    </button>
                    <button
                        onClick={() => handleDownload("jpg")}
                        disabled={isDownloading}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:bg-purple-600/50 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                        {isDownloading && downloadFormat === "jpg" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        JPG
                    </button>
                </div>
            </div>
            <div id="resume-export" className="w-full max-w-[800px] pb-24 bg-transparent">
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
