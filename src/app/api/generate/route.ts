import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://airesumemaker.com", // Optional, for OpenRouter stats
                "X-Title": "AI Resume Maker", // Optional, for OpenRouter stats
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // You can switch this to a better model via OpenRouter
                messages: [
                    {
                        role: "system",
                        content: `You are an expert ATS-friendly resume writer. Your job is to take the provided user information, optimize the phrasing with powerful action verbs, structure it cleanly, and return a professional resume formatted ONLY in Markdown. Include sections for Header, Skills, Experience, Education, and Projects depending on what is provided. Do NOT add conversational text. Return ONLY the markdown.`,
                    },
                    {
                        role: "user",
                        content: `Please generate my resume based on the following details:
            Name: ${body.fullName}
            Email: ${body.email}
            Phone: ${body.phone}
            
            Skills: ${body.skills}
            
            Experience: ${body.experience}
            
            Education: ${body.education}
            
            Projects: ${body.projects}
            `,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", errorText);
            return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
        }

        const data = await response.json();
        const markdown = data.choices[0].message.content;

        return NextResponse.json({ markdown });
    } catch (error) {
        console.error("Generate route error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
