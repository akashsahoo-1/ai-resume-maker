import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

// Creative template has a sidebar layout
export default function CreativeTemplate({ markdown }: { markdown: string }) {
    if (!markdown) return null;

    // Split markdown into logical sections
    const sections = markdown.split(/(?=^## )/m);

    // Usually the first section before any '## ' is the name and contact info
    const header = sections.length > 0 ? sections[0] : "";
    const remaining = sections.slice(1);

    const sidebarSections = remaining.filter(
        s => s.startsWith("## Skills") || s.startsWith("## Education") || s.startsWith("## Languages") || s.startsWith("## Certifications")
    );
    const mainSections = remaining.filter(
        s => !sidebarSections.includes(s)
    );

    return (
        <motion.div
            id="resume-preview-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row min-h-full bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-[#ffffff] p-4 md:p-8 rounded-2xl shadow-2xl overflow-hidden gap-6"
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            <div className="w-full md:w-1/3 bg-[#00000066] rounded-2xl p-6 backdrop-blur-md border border-[#ffffff1a] flex flex-col gap-6">
                <div className="max-w-none text-[#e9d5ff] leading-relaxed [&>h1]:text-[2.2rem] [&>h1]:leading-tight [&>h1]:font-black [&>h1]:text-transparent [&>h1]:bg-clip-text [&>h1]:bg-gradient-to-r [&>h1]:from-[#c084fc] [&>h1]:to-[#f472b6] [&>h1]:mb-2 [&>h1+p]:text-sm [&>h1+p]:text-[#e9d5ff] [&>h1+p]:break-words [&>p]:text-[#e9d5ff] [&>p]:mb-2 [&>a]:text-[#d8b4fe]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{header}</ReactMarkdown>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-[#a855f780] to-transparent my-1"></div>

                <div className="max-w-none text-sm text-[#f3e8ff] leading-relaxed [&>h2]:text-lg [&>h2]:text-[#d8b4fe] [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:mb-3 [&>h2]:mt-0 [&>p]:mb-4 [&>ul]:pl-4 [&>ul]:list-disc [&>ul]:mb-6 [&>li]:mb-1 [&>h3]:text-base [&>h3]:text-[#ffffff] [&>ul>li]:text-[#f3e8ff]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{sidebarSections.join("\n")}</ReactMarkdown>
                </div>
            </div>

            <div className="w-full md:w-2/3 bg-[#ffffff0d] rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#ffffff0d]">
                <div className="max-w-none text-[#f3e8ff] leading-relaxed [&>h2]:text-2xl [&>h2]:text-transparent [&>h2]:bg-clip-text [&>h2]:bg-gradient-to-r [&>h2]:from-[#d8b4fe] [&>h2]:to-[#a5b4fc] [&>h2]:border-b [&>h2]:border-[#ffffff1a] [&>h2]:pb-2 [&>h2]:mb-6 [&>h2]:mt-0 [&>h3]:text-xl [&>h3]:text-[#ffffff] [&>h3]:font-semibold [&>h3]:mt-6 [&>ul]:pl-5 [&>ul]:list-disc [&>ul]:mb-6 [&>li]:text-[#f3e8ffe6] [&>li]:mb-2 [&>li]:marker:text-[#a855f7] [&>p]:text-[#f3e8ff] [&>p]:mb-4 [&>a]:text-[#c084fc] [&>hr]:border-[#ffffff1a] [&>hr]:my-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainSections.join("\n")}</ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
}
