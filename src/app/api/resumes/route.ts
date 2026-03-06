import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            fullName,
            email,
            phone,
            summary,
            skills,
            experience,
            education,
            projects,
            certifications,
            achievements,
            languages,
            github,
            linkedin,
            portfolio,
            hobbies,
            generatedMarkdown
        } = body;

        // Generate a unique slug based on fullName
        const slug =
            (fullName || "resume")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "") +
            "-" +
            Math.random().toString(36).substring(2, 7);

        const { data, error } = await supabaseClient
            .from("resumes")
            .insert([
                {
                    title,
                    full_name: fullName,
                    email,
                    phone,
                    summary,
                    skills,
                    experience,
                    education,
                    projects,
                    certifications,
                    achievements,
                    languages,
                    github,
                    linkedin,
                    portfolio,
                    hobbies,
                    generated_markdown: generatedMarkdown,
                    slug,
                },
            ])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: error.message || "Failed to save to database", details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Save resume route error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
