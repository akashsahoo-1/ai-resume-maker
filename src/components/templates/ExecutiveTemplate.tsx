import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

export default function ExecutiveTemplate({ markdown }: { markdown: string }) {
    if (!markdown) return null;

    return (
        <motion.div
            id="resume-preview-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-none bg-[#0a1128] text-[#cbd5e1] p-10 md:p-16 rounded-sm shadow-2xl border border-[#1e293b]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <div className="text-[#cbd5e1] leading-relaxed [&>h1]:text-[3rem] [&>h1]:leading-tight [&>h1]:text-center [&>h1]:text-[#f1f5f9] [&>h1]:mb-3 [&>h1+p]:text-center [&>h1+p]:text-[#94a3b8] [&>h1+p]:text-sm [&>h1+p]:mb-10 [&>h1+p]:border-b [&>h1+p]:border-[#334155] [&>h1+p]:pb-6 [&>h2]:text-[#f1f5f9] [&>h2]:text-xl [&>h2]:font-bold [&>h2]:border-b-2 [&>h2]:border-[#1e40af] [&>h2]:pb-2 [&>h2]:mt-8 [&>h2]:mb-6 [&>h2]:uppercase [&>h2]:tracking-wider [&>h3]:text-[#f1f5f9] [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-6 [&>p]:text-[#cbd5e1] [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>li]:text-[#cbd5e1] [&>li]:marker:text-[#475569] [&>li]:mb-2 [&>a]:text-[#3b82f6] [&>hr]:border-[#1e293b] [&>hr]:my-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
        </motion.div>
    );
}
