"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Plus, FileText, Trash2, Calendar, LayoutTemplate, Edit2, Share2, CheckCheck, X } from "lucide-react";
import { supabaseClient } from "../../lib/supabase";

type SavedResume = {
    id: string;
    created_at: string;
    title?: string;
    fullName: string;
    email: string;
    phone: string;
    summary?: string;
    skills: string;
    experience: string;
    education: string;
    projects?: string;
    certifications?: string;
    achievements?: string;
    languages?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    generatedMarkdown: string;
    slug?: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [resumes, setResumes] = useState<SavedResume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Rename Modal State
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [resumeToRename, setResumeToRename] = useState<SavedResume | null>(null);
    const [newRenameTitle, setNewRenameTitle] = useState("");

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

    const handleShare = async (resume: SavedResume) => {
        let slugToShare = resume.slug;

        if (!slugToShare) {
            slugToShare =
                (resume.fullName || "resume")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "") +
                "-" +
                Math.random().toString(36).substring(2, 7);

            const { error } = await supabaseClient
                .from("resumes")
                .update({ slug: slugToShare })
                .eq("id", resume.id);

            if (error) {
                console.error("Failed to update slug:", error);
                alert("Failed to generate a share link. Please try again.");
                return;
            }

            setResumes((prev) => prev.map((r) => (r.id === resume.id ? { ...r, slug: slugToShare } : r)));
        }

        const url = `${window.location.origin}/resume/${slugToShare}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(resume.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
            prompt("Copy this link:", url);
        }
    };

    useEffect(() => {
        const fetchResumesAndAuth = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setIsCheckingAuth(false);

            // Fetch user's resumes
            const { data, error } = await supabaseClient
                .from("resumes")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Failed to fetch resumes:", error);
            } else {
                setResumes(data || []);
            }
            setIsLoading(false);
        };

        fetchResumesAndAuth();

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleOpenResume = (resume: SavedResume) => {
        // Repopulate localStorage with the saved resume data
        const formData = {
            fullName: resume.fullName,
            email: resume.email,
            phone: resume.phone,
            summary: resume.summary || "",
            skills: resume.skills,
            experience: resume.experience,
            education: resume.education,
            projects: resume.projects || "",
            certifications: resume.certifications || "",
            achievements: resume.achievements || "",
            languages: resume.languages || "",
            github: resume.github || "",
            linkedin: resume.linkedin || "",
            portfolio: resume.portfolio || "",
        };

        localStorage.setItem("resumeFormData", JSON.stringify(formData));
        localStorage.setItem("resumeGeneratedContent", resume.generatedMarkdown);

        // Redirect to builder
        router.push("/builder");
    };

    const confirmDeleteResume = async () => {
        if (!resumeToDelete) return;

        setDeletingId(resumeToDelete);
        try {
            const { error } = await supabaseClient
                .from("resumes")
                .delete()
                .eq("id", resumeToDelete);

            if (error) throw error;

            // Remove from local state optimistically
            setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete));
        } catch (error) {
            console.error("Failed to delete resume:", error);
        } finally {
            setDeletingId(null);
            setResumeToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    const handleRenameClick = (resume: SavedResume) => {
        setResumeToRename(resume);
        setNewRenameTitle(resume.title || "Untitled Resume");
        setShowRenameModal(true);
    };

    const confirmRenameResume = async () => {
        if (!resumeToRename || !newRenameTitle || newRenameTitle.trim() === "" || newRenameTitle === resumeToRename.title) {
            setShowRenameModal(false);
            return;
        }

        setRenamingId(resumeToRename.id);
        setShowRenameModal(false);

        try {
            const { error } = await supabaseClient
                .from("resumes")
                .update({ title: newRenameTitle })
                .eq("id", resumeToRename.id);

            if (error) throw error;

            // Update local state optimistically
            setResumes((prev) => prev.map((r) => r.id === resumeToRename.id ? { ...r, title: newRenameTitle } : r));
        } catch (error) {
            console.error("Failed to rename resume:", error);
        } finally {
            setRenamingId(null);
            setResumeToRename(null);
            setNewRenameTitle("");
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
        <div className="min-h-screen p-6 md:p-12 relative z-10">
            <div className="max-w-6xl mx-auto">
                {/* Header Options */}
                <div className="flex items-center justify-between mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-white transition-colors"
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

                {/* Dashboard Title & Action Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8 relative">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your Dashboard</h1>
                        <p className="text-lg text-neutral-400 max-w-xl">Manage and download your intelligently generated professional resumes.</p>
                    </div>
                    <Link href="/templates">
                        <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.7)] border border-white/10">
                            <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="relative z-10">Create New Resume</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </Link>
                </div>

                {/* Resumes Grid Array */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                            <Loader2 className="relative w-10 h-10 text-purple-400 animate-spin mb-4" />
                        </div>
                        <p className="text-neutral-400 tracking-wide">Loading your resumes...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border border-dashed border-white/20 bg-black/40 backdrop-blur-xl group hover:bg-white/5 transition-colors duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative z-10">
                            <FileText className="w-10 h-10 text-purple-400/80" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 relative z-10 text-white/90">No resumes found</h3>
                        <p className="text-neutral-400 max-w-md mb-8 leading-relaxed relative z-10">You haven't generated any professional resumes yet. Click the button below to browse templates and get started.</p>
                        <Link href="/templates">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all relative z-10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                <LayoutTemplate className="w-5 h-5" />
                                Browse Templates
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                key={resume.id}
                                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative group hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/5 flex items-center justify-center shadow-inner">
                                        <FileText className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleRenameClick(resume)}
                                            disabled={renamingId === resume.id}
                                            className="p-2 text-neutral-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors disabled:opacity-50"
                                            title="Rename"
                                        >
                                            {renamingId === resume.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                            ) : (
                                                <Edit2 className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setResumeToDelete(resume.id);
                                                setDeleteModalOpen(true);
                                            }}
                                            disabled={deletingId === resume.id}
                                            className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {deletingId === resume.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                    {resume.title || "Untitled Resume"}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(resume.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                                    <button
                                        onClick={() => handleOpenResume(resume)}
                                        className="py-3 bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 text-white rounded-xl font-medium transition-all duration-300 border border-white/5 hover:border-purple-500/30 w-full flex justify-center items-center gap-2 group/btn relative overflow-hidden"
                                    >
                                        <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare(resume)}
                                        className="py-3 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 text-white rounded-xl font-medium transition-all duration-300 border border-white/5 hover:border-indigo-500/30 w-full flex justify-center items-center gap-2 group/btn relative overflow-hidden"
                                    >
                                        {copiedId === resume.id ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />}
                                        <span className={copiedId === resume.id ? "text-emerald-400" : ""}>{copiedId === resume.id ? "Copied" : "Share"}</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rename Modal */}
            <AnimatePresence>
                {showRenameModal && (
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
                            className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                    <Edit2 className="w-6 h-6 text-purple-400" />
                                    Rename Resume
                                </h2>
                                <button
                                    onClick={() => setShowRenameModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                            
                            <p className="text-neutral-400 text-sm mb-6">
                                Enter a new title for your resume so you can easily identify it later.
                            </p>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={newRenameTitle}
                                    onChange={(e) => setNewRenameTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            confirmRenameResume();
                                        }
                                    }}
                                    autoFocus
                                    placeholder="e.g. Frontend Developer Role"
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-neutral-600 mb-2 transition-all"
                                />
                                
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowRenameModal(false)}
                                        className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmRenameResume}
                                        disabled={!newRenameTitle.trim() || (!!resumeToRename && newRenameTitle === resumeToRename.title)}
                                        className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModalOpen && resumeToDelete && (
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
                            className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                    Delete Resume
                                </h2>
                                <button
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setResumeToDelete(null);
                                    }}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                            
                            <p className="text-neutral-300 text-base mb-8 leading-relaxed">
                                Are you sure you want to delete this resume? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setResumeToDelete(null);
                                    }}
                                    className="flex-1 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteResume}
                                    disabled={deletingId === resumeToDelete}
                                    className="flex-[2] py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    {deletingId === resumeToDelete ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
