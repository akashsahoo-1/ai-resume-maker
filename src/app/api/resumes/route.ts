import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, phone, skills, experience, education, projects, generatedMarkdown } = body;

        const { data, error } = await supabaseClient
            .from("resumes")
            .insert([
                {
                    full_name: fullName,
                    email,
                    phone,
                    skills,
                    experience,
                    education,
                    projects,
                    generated_markdown: generatedMarkdown,
                },
            ])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Save resume route error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
