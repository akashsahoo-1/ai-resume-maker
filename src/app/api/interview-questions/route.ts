import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.markdown) {
            return NextResponse.json({ error: "Resume markdown is required" }, { status: 400 });
        }

        let systemPrompt = `You are an expert technical interviewer and recruiter. Analyze the provided resume markdown and generate 8 to 10 highly realistic interview questions that an interviewer might ask this candidate.
                        
                        CRITICAL RULES:
                        1. Focus on the candidate's specific projects, skills, education, and experience. Don't be overly generic.
                        2. Format the response strictly as a Markdown numbered list (e.g., "1. Question...", "2. Question...").
                        3. Do not add conversational intro/outro text, just return the numbered list.`;

        let userPrompt = `Here is the resume markdown:\n\n${body.markdown}`;

        if (body.jobRole && body.jobRole.trim() !== "") {
            systemPrompt = `You are an expert technical interviewer and recruiter. Based on the provided resume markdown and the targeted job role of ${body.jobRole}, generate 10 highly realistic interview questions that an interviewer might ask this candidate.
                        
                        CRITICAL RULES:
                        1. Focus on how the candidate's specific projects, skills, education, and experience relate to the role of ${body.jobRole}.
                        2. Format the response strictly as a Markdown numbered list (e.g., "1. Question...", "2. Question...").
                        3. Do not add conversational intro/outro text, just return the numbered list.`;

            userPrompt = `Based on this resume and the target role of ${body.jobRole}, generate 10 realistic interview questions that an interviewer might ask.\n\nHere is the resume markdown:\n\n${body.markdown}`;
        }

        // Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://airesumemaker.com",
                "X-Title": "AI Resume Maker",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", errorText, response.status, response.statusText);
            return NextResponse.json({ error: "Failed to generate interview questions", details: errorText }, { status: response.status });
        }

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenRouter API invalid response format:", data);
            return NextResponse.json({ error: "Invalid response structure from AI model" }, { status: 500 });
        }

        const questionsMarkdown = data.choices[0].message.content;

        return NextResponse.json({ questions: questionsMarkdown });
    } catch (error: unknown) {
        console.error("Generate interview questions route error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
