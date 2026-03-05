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
            className="prose prose-invert max-w-none bg-[#0a1128] text-slate-300 p-10 md:p-16 rounded-sm shadow-2xl border border-slate-800"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <div className="[&>h1]:text-[3rem] [&>h1]:leading-tight [&>h1]:text-center [&>h1]:text-slate-100 [&>h1]:mb-3 [&>h1+p]:text-center [&>h1+p]:text-slate-400 [&>h1+p]:text-sm [&>h1+p]:mb-10 [&>h1+p]:border-b [&>h1+p]:border-slate-700 [&>h1+p]:pb-6 [&>h2]:text-slate-100 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:border-b-2 [&>h2]:border-[#1e40af] [&>h2]:pb-2 [&>h2]:mt-8 [&>h2]:mb-6 [&>h2]:uppercase [&>h2]:tracking-wider [&>h3]:text-[#f1f5f9] [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-6 [&>p]:text-slate-300 [&>ul]:pl-6 [&>li]:text-slate-300 [&>li]:marker:text-[#475569] [&>li]:mb-2 [&>hr]:border-slate-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
        </motion.div>
    );
}
