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
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert ATS-friendly resume writer. Your job is to take the provided user information, optimize the phrasing with powerful action verbs, structure it cleanly, and return a professional resume formatted ONLY in Markdown. 
                        
                        CRITICAL LAYOUT RULES:
                        1. NO "Header" label. Display the Name as the main H1 heading at the very top.
                        2. Contact Info: Display Email, Phone, and all Social Links (GitHub, LinkedIn, Portfolio) on a SINGLE line immediately below the name, separated by " | ". Ensure it does not break into multiple lines.
                        3. Section Visibility: ONLY include a section if data is provided for it. If a field is empty, null, or contains placeholders like "None", "None listed", or "N/A", do NOT include that section heading or content in the markdown.
                        4. Professional Summary: Use "## Professional Summary" as the heading.
                        5. Skills: Use "## Skills" as the heading. List skills horizontally on a single line separated by " | ". Do NOT use bullet points.
                        6. Experience: Use "## Experience" as the heading. Use concise bullet points for responsibilities.
                        7. Projects: Use "## Projects" as the heading. List projects with their titles as H3. Do NOT use numbering.
                        8. Education: Use "## Education" as the heading. Render each education entry as a separate markdown list item (starting with "- ") on its own line. Split entries based on common separators like commas or newlines provided in the input. Ensure each degree/institution appears on a new line. (e.g., "- Degree — University (Year)").
                        9. Other Sections (Certifications, Achievements, Languages): Use appropriate "##" headings ONLY if content exists.
                        
                        CRITICAL FORMATTING RULES FOR LINKS:
                        In the Header section, provide Email as a clickable markdown mailto link and Social Links as plain URLs:
                        [email@example.com](mailto:email@example.com) | Phone | https://github.com/username | https://linkedin.com/in/username
                        
                        Maintain a compact structure to fit on one page. Do NOT add conversational text. Return ONLY the markdown.`,
                    },
                    {
                        role: "user",
                        content: `Please generate my resume based on the following details (ONLY include sections that have non-empty content):
            Name: ${body.fullName}
            Email: ${body.email}
            Phone: ${body.phone}
            ${body.github || body.linkedin || body.portfolio ? `Links: ${[body.github ? `GitHub: ${body.github}` : '', body.linkedin ? `LinkedIn: ${body.linkedin}` : '', body.portfolio ? `Portfolio: ${body.portfolio}` : ''].filter(Boolean).join(' | ')}` : ''}
            
            ${body.summary && !['None', 'None listed', 'N/A'].includes(body.summary) ? `Professional Summary: ${body.summary}` : ''}
            
            ${body.skills && !['None', 'None listed', 'N/A'].includes(body.skills) ? `Skills: ${body.skills}` : ''}
            
            ${body.experience && !['None', 'None listed', 'N/A'].includes(body.experience) ? `Experience: ${body.experience}` : ''}
            
            ${body.projects && !['None', 'None listed', 'N/A'].includes(body.projects) ? `Projects: ${body.projects}` : ''}
            
            ${body.education && !['None', 'None listed', 'N/A'].includes(body.education) ? `Education: ${body.education}` : ''}
            
            ${body.certifications && !['None', 'None listed', 'N/A'].includes(body.certifications) ? `Certifications: ${body.certifications}` : ''}
            
            ${body.achievements && !['None', 'None listed', 'N/A'].includes(body.achievements) ? `Achievements: ${body.achievements}` : ''}
            
            ${body.languages && !['None', 'None listed', 'N/A'].includes(body.languages) ? `Languages: ${body.languages}` : ''}
            `,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", errorText, response.status, response.statusText);
            return NextResponse.json({ error: "Failed to generate resume", details: errorText }, { status: response.status });
        }

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenRouter API invalid response format:", data);
            return NextResponse.json({ error: "Invalid response structure from AI model" }, { status: 500 });
        }

        const markdown = data.choices[0].message.content;

        return NextResponse.json({ markdown });
    } catch (error: any) {
        console.error("Generate route error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
