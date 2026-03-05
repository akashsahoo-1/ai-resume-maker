import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { summary, skills, experience, projects, education, certifications } = body;

        const combinedText = `
            Professional Summary: ${summary}
            Skills: ${skills}
            Experience: ${experience}
            Projects: ${projects}
            Education: ${education}
            Certifications: ${certifications}
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://airesumemaker.com",
                "X-Title": "AI Resume Maker - ATS Analyzer",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert Applicant Tracking System (ATS) analyzer. Your task is to analyze the provided resume text and provide a comprehensive feedback report. 
                        Return your response ONLY in Markdown format with the following sections:
                        1. ATS Score: [score]/100
                        2. Strengths (as a bulleted list)
                        3. Improvements (as a bulleted list)
                        4. Suggested Keywords (as a bulleted list)
                        Be critical and professional.`,
                    },
                    {
                        role: "user",
                        content: `Analyze the following resume for ATS compatibility and suggest improvements:\n${combinedText}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error (Analyze):", errorText, response.status, response.statusText);
            return NextResponse.json({ error: "Failed to analyze resume", details: errorText }, { status: response.status });
        }

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenRouter API invalid response format:", data);
            return NextResponse.json({ error: "Invalid response structure from AI model" }, { status: 500 });
        }

        const analysis = data.choices[0].message.content;

        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error("Analyze route error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
