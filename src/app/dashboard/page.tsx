"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Plus, FileText, Trash2, Calendar, LayoutTemplate, Edit2, Copy, Share2, CheckCheck } from "lucide-react";
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
    const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

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

    const handleDeleteResume = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) {
            return;
        }

        setDeletingId(id);
        try {
            const { error } = await supabaseClient
                .from("resumes")
                .delete()
                .eq("id", id);

            if (error) throw error;

            // Remove from local state optimistically
            setResumes((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error("Failed to delete resume:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleRenameResume = async (resume: SavedResume) => {
        const newTitle = window.prompt("Enter new resume title:", resume.title || "Untitled Resume");

        if (!newTitle || newTitle.trim() === "" || newTitle === resume.title) {
            return;
        }

        setRenamingId(resume.id);
        try {
            const { error } = await supabaseClient
                .from("resumes")
                .update({ title: newTitle })
                .eq("id", resume.id);

            if (error) throw error;

            // Update local state optimistically
            setResumes((prev) => prev.map((r) => r.id === resume.id ? { ...r, title: newTitle } : r));
        } catch (error) {
            console.error("Failed to rename resume:", error);
        } finally {
            setRenamingId(null);
        }
    };

    const handleDuplicateResume = async (resume: SavedResume) => {
        setDuplicatingId(resume.id);
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) throw new Error("No session found");

            const newTitle = `${resume.title || "Untitled Resume"} Copy`;

            const slug =
                (resume.fullName || "resume")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "") +
                "-" +
                Math.random().toString(36).substring(2, 7);

            const { data, error } = await supabaseClient
                .from("resumes")
                .insert([
                    {
                        user_id: session.user.id,
                        title: newTitle,
                        full_name: resume.fullName,
                        email: resume.email,
                        phone: resume.phone,
                        summary: resume.summary,
                        skills: resume.skills,
                        experience: resume.experience,
                        education: resume.education,
                        projects: resume.projects,
                        certifications: resume.certifications,
                        achievements: resume.achievements,
                        languages: resume.languages,
                        github: resume.github,
                        linkedin: resume.linkedin,
                        portfolio: resume.portfolio,
                        generated_markdown: resume.generatedMarkdown,
                        slug: slug,
                    },
                ])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                // Add the duplicated resume to the top of the local state
                setResumes((prev) => [data[0], ...prev]);
            }
        } catch (error) {
            console.error("Failed to duplicate resume:", error);
        } finally {
            setDuplicatingId(null);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-50">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-neutral-400 font-medium">Verifying authorization...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 md:p-12">
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Dashboard</h1>
                        <p className="text-lg text-neutral-400">Manage your generated AI resumes.</p>
                    </div>
                    <Link href="/templates">
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]">
                            <Plus className="w-5 h-5" />
                            Create New Resume
                        </button>
                    </Link>
                </div>

                {/* Resumes Grid Array */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                        <p className="text-neutral-400">Loading your resumes...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border border-dashed border-white/10 bg-neutral-900/30">
                        <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
                            <FileText className="w-8 h-8 text-neutral-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No resumes found</h3>
                        <p className="text-neutral-400 max-w-sm mb-8">You haven't generated any resumes yet. Click the button below to get started.</p>
                        <Link href="/templates">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
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
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                key={resume.id}
                                className="bg-neutral-900 border border-white/5 rounded-2xl p-6 relative group hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleRenameResume(resume)}
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
                                            onClick={() => handleDuplicateResume(resume)}
                                            disabled={duplicatingId === resume.id}
                                            className="p-2 text-neutral-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors disabled:opacity-50"
                                            title="Duplicate"
                                        >
                                            {duplicatingId === resume.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteResume(resume.id)}
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

                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <button
                                        onClick={() => handleOpenResume(resume)}
                                        className="py-2.5 bg-white/5 hover:bg-indigo-500/10 hover:text-indigo-400 text-white rounded-lg font-medium transition-colors border border-transparent hover:border-indigo-500/20 w-full flex justify-center items-center gap-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleShare(resume)}
                                        className="py-2.5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-white rounded-lg font-medium transition-colors border border-transparent hover:border-emerald-500/20 w-full flex justify-center items-center gap-2"
                                    >
                                        {copiedId === resume.id ? <CheckCheck className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                        {copiedId === resume.id ? "Copied" : "Share"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
