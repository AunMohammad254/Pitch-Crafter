export interface PitchData {
  name: string;
  tagline: string;
  elevator_pitch: string;
  problem: string;
  solution: string;
  target_audience?: {
    description: string;
    segments: string[];
  };
  unique_value_proposition: string;
  landing_copy?: {
    headline: string;
    subheadline: string;
    call_to_action: string;
  };
  industry: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  logo_ideas: string[];
}

export const generatePitchPrompt = (prompt: string): string => `
ACT AS A PROFESSIONAL STARTUP CONSULTANT. Generate a comprehensive startup pitch package from this idea: "${prompt}"

Return ONLY valid JSON with this exact structure:
{
  "name": "Creative startup name",
  "tagline": "Catchy one-liner",
  "elevator_pitch": "2-4 sentence compelling story",
  "problem": "Clear problem statement",
  "solution": "Innovative solution description", 
  "target_audience": {
    "description": "Primary customer description",
    "segments": ["segment 1", "segment 2", "segment 3"]
  },
  "unique_value_proposition": "What makes it unique vs competitors",
  "landing_copy": {
    "headline": "Attention-grabbing headline",
    "subheadline": "Supporting description",
    "call_to_action": "Action-oriented CTA"
  },
  "industry": "Relevant industry",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex", 
    "accent": "#hex",
    "neutral": "#hex"
  },
  "logo_ideas": ["creative idea 1", "creative idea 2", "creative idea 3"]
}
`;

export const generateWebsitePrompt = (pitchData: PitchData): string => `Create a stunning, modern landing page HTML for: ${pitchData.name} - ${pitchData.tagline}

Details:
- Problem: ${pitchData.problem}
- Solution: ${pitchData.solution} 
- UVP: ${pitchData.unique_value_proposition}
- Colors: ${JSON.stringify(pitchData.colors)}
- Audience: ${pitchData.target_audience?.description}

Requirements:
- Use Tailwind CSS CDN
- Modern glass morphism design
- Fully responsive layout
- Smooth animations
- Professional startup aesthetic
- Include: Hero, Features, Testimonials, CTA, Footer
- Add interactive elements
- IMPORTANT: Do NOT use any <img> tags pointing to external URLs or local file paths (e.g. logo.png, logo.svg) as they will fail to load and show a broken image icon.
- For logos, icons, and branding illustrations, use inline SVG code or emojis.
- Do NOT use React-style JSX syntax (like className or src={...}) in the HTML code. Output only standard, pure static HTML with native attributes (class, src, style, etc.).
- Use CSS gradients, inline SVG icons, and solid colors for visual elements.
- Use text placeholders for testimonials instead of image avatars.

Return ONLY complete HTML code:`;

export const generateInvestorPrompt = (pitchData: PitchData): string => `
ACT AS A TOUGH, SKEPTICAL VENTURE CAPITALIST(SHARK TANK STYLE).
You are evaluating a startup pitch for: "${pitchData.name}".
  Tagline: "${pitchData.tagline}"
Problem: "${pitchData.problem}"
Solution: "${pitchData.solution}"
Business Model: Assess based on industry standards.

Your Goal: Grill the founder.Find holes in their logic.Be direct, slightly intimidating, but fair.
- Do NOT be overly supportive.
- Ask about CAC, LTV, market size, and competition.
- If the user gives vague answers, call them out.
- Keep responses short(under 3 sentences) and conversational.
- End every response with a tough question.

Start by introducing yourself as "Marcus" (or another shark name) and ask the first hard question based on their pitch.
`;

export const generatePitchFeedback = (pitchData: PitchData, transcript: string): string => `
ACT AS A PUBLIC SPEAKING COACH AND STARTUP EXPERT.
Analyze this spoken pitch transcript against the original elevator pitch.

Original Script: "${pitchData.elevator_pitch}"
Spoken Transcript: "${transcript}"

Provide a structured evaluation in valid JSON format.
RETURN ONLY THE JSON OBJECT. NO MARKDOWN. NO CONVERSATIONAL TEXT.
{
  "score": 85, // 0-100 score
  "pacing": "Fast/Slow/Good",
  "clarity": "Feedback on clarity",
  "missing_points": ["Key point 1 missing", "Key point 2 missing"],
  "improvements": ["Specific improvement 1", "Specific improvement 2"],
  "positive_feedback": "What they did well"
}
`;
