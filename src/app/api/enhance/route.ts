import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { summary, skills, experience, projects, education, certifications, achievements, languages } = body;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://airesumemaker.com",
                "X-Title": "AI Resume Maker - Enhancer",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert resume optimizer. Your task is to take the provided resume sections and enhance the wording to be more professional, impactful, and ATS-friendly. 
                        
                        Rules:
                        1. Use strong action verbs (e.g., "Spearheaded", "Optimized", "Engineered").
                        2. Quantify achievements where possible.
                        3. Improve clarity and flow while keeping the content factual.
                        4. Return the enhanced content as a JSON object with the exact same keys as provided.
                        5. Do NOT change the structure or provide conversational text. Return ONLY the JSON object.`,
                    },
                    {
                        role: "user",
                        content: `Enhance the following resume sections and return them in a JSON format:\n${JSON.stringify({ summary, skills, experience, projects, education, certifications, achievements, languages })}`,
                    },
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error (Enhance):", errorText, response.status, response.statusText);
            return NextResponse.json({ error: "Failed to enhance resume", details: errorText }, { status: response.status });
        }

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenRouter API invalid response format:", data);
            return NextResponse.json({ error: "Invalid response structure from AI model" }, { status: 500 });
        }

        let enhancedData;
        try {
            enhancedData = JSON.parse(data.choices[0].message.content);
        } catch (parseError) {
            console.error("Failed to parse enhanced data JSON:", parseError, data.choices[0].message.content);
            return NextResponse.json({ error: "Invalid JSON from AI model" }, { status: 500 });
        }

        return NextResponse.json({ enhancedData });
    } catch (error: any) {
        console.error("Enhance route error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
