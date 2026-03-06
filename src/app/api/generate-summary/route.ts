import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, skills, education, projects, experience } = body;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://airesumemaker.com",
                "X-Title": "AI Resume Maker - Summary Generator",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert resume writer. Generate a professional summary (3-4 sentences max) for a resume based on the provided user details. 
                        
                        Rules:
                        1. Focus on the candidate's core strengths, experience, and top skills.
                        2. Write in the third person or first person without pronouns (e.g., "Experienced software engineer with...", not "I am an experienced...").
                        3. Be professional, impactful, and concise.
                        4. Return ONLY the generated summary text. Do not include quotes, markdown formatting, or conversational text.`,
                    },
                    {
                        role: "user",
                        content: `Please generate a professional summary based on the following details:
                        Name: ${fullName || 'Not provided'}
                        Skills: ${skills || 'Not provided'}
                        Experience: ${experience || 'Not provided'}
                        Education: ${education || 'Not provided'}
                        Projects: ${projects || 'Not provided'}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error (Generate Summary):", errorText, response.status, response.statusText);
            return NextResponse.json({ error: "Failed to generate summary", details: errorText }, { status: response.status });
        }

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenRouter API invalid response format:", data);
            return NextResponse.json({ error: "Invalid response structure from AI model" }, { status: 500 });
        }

        const summary = data.choices[0].message.content.trim();

        return NextResponse.json({ summary });
    } catch (error: unknown) {
        console.error("Generate summary route error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
