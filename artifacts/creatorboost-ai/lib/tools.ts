export type ToolCategory = "youtube" | "instagram" | "advanced";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  iconSet: "MaterialCommunityIcons" | "Ionicons" | "Feather" | "MaterialIcons";
  proOnly?: boolean;
  buildPrompt: (input: string, extra?: string) => string;
  inputLabel: string;
  inputPlaceholder: string;
  extraLabel?: string;
  extraPlaceholder?: string;
}

export const TOOLS: Tool[] = [
  // ── YouTube ──────────────────────────────────────────────────────────────
  {
    id: "yt_title",
    name: "Viral Title Generator",
    description: "Hook-based titles that drive clicks",
    category: "youtube",
    icon: "youtube",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Video Topic",
    inputPlaceholder: "e.g. How to grow on YouTube in 2024",
    buildPrompt: (topic) =>
      `You are a YouTube expert. Generate 10 viral, click-worthy YouTube video titles for the topic: "${topic}". 
Use proven hooks: curiosity gaps, numbers, how-to, listicles, emotional triggers. 
Format each title on a new line with a number prefix. Make them SEO optimized and attention-grabbing.`,
  },
  {
    id: "yt_description",
    name: "SEO Description",
    description: "Full description with timestamps & SEO",
    category: "youtube",
    icon: "text-box-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Video Title / Topic",
    inputPlaceholder: "e.g. 10 Photoshop tips for beginners",
    buildPrompt: (topic) =>
      `Write a professional YouTube SEO description for a video titled: "${topic}".
Include: an engaging first 2 lines (shown before "show more"), relevant keywords naturally embedded, a section with 5-7 timestamp markers (use 0:00 format), 3 related video links placeholder, subscribe CTA, and social links placeholder.
Make it 250-400 words. Format clearly with sections.`,
  },
  {
    id: "yt_tags",
    name: "Tags Generator",
    description: "High-ranking tags for maximum reach",
    category: "youtube",
    icon: "tag-multiple-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Video Topic / Niche",
    inputPlaceholder: "e.g. fitness motivation workout",
    buildPrompt: (topic) =>
      `Generate 30 high-ranking YouTube tags for the topic: "${topic}".
Mix: broad tags (high volume), mid-tail tags (medium competition), long-tail tags (specific intent). 
List them comma-separated. Include variations, synonyms, and trending related terms.`,
  },
  {
    id: "yt_keywords",
    name: "Keyword Research",
    description: "Search volume & competition analysis",
    category: "youtube",
    icon: "magnify",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Niche / Topic",
    inputPlaceholder: "e.g. personal finance for beginners",
    buildPrompt: (topic) =>
      `Act as a YouTube keyword research expert. For the niche: "${topic}", provide:
1. Top 10 primary keywords with estimated search intent (High/Medium/Low volume, Low/Medium/High competition)
2. Top 10 long-tail keywords (easier to rank, very specific)
3. Top 5 trending keywords for 2024-2025
4. 3 content gap opportunities competitors miss
Format as a clear table/list. Explain strategy briefly.`,
  },
  {
    id: "yt_thumbnail",
    name: "Thumbnail Text Generator",
    description: "Bold, click-worthy thumbnail phrases",
    category: "youtube",
    icon: "image-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Video Topic",
    inputPlaceholder: "e.g. I lost 10kg in 30 days",
    buildPrompt: (topic) =>
      `Generate 15 bold thumbnail text phrases for a YouTube video about: "${topic}".
Rules: Max 4-5 words each, use shock/curiosity/emotion, use numbers when possible, mix with emotional hooks (NEVER, ALWAYS, FINALLY, etc.). 
Also suggest 3 thumbnail design concepts (color scheme, face expression, background idea). List clearly.`,
  },
  {
    id: "yt_shorts",
    name: "Shorts Ideas Generator",
    description: "Fast-paced concepts for YouTube Shorts",
    category: "youtube",
    icon: "lightning-bolt",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Your Niche / Channel Topic",
    inputPlaceholder: "e.g. cooking hacks, tech reviews",
    buildPrompt: (niche) =>
      `Generate 10 viral YouTube Shorts ideas for a creator in the "${niche}" niche.
For each idea include: Title (under 60 chars), Hook (first 2 seconds script), Core concept (3-4 sentences), Trending angle/twist.
Format clearly numbered. Focus on fast-paced, attention-grabbing, shareable content that works in under 60 seconds.`,
  },
  {
    id: "yt_script",
    name: "AI Script Generator",
    description: "Full scripts with Hook, Body & CTA",
    category: "youtube",
    icon: "script-text-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Video Topic",
    inputPlaceholder: "e.g. How to start investing with 1000 rupees",
    buildPrompt: (topic) =>
      `Write a complete YouTube video script for: "${topic}".
Structure:
[HOOK - 30 seconds]: Attention-grabbing opening that makes viewers stay
[INTRO - 30 seconds]: Introduce yourself and what they'll learn
[BODY - Main content with 3-5 key points, each with examples]
[TRANSITION lines between sections]
[CTA - 60 seconds]: Subscribe ask, comment prompt, end screen suggestion
Keep total script to 5-7 minutes reading time. Use conversational, engaging tone. Add [B-ROLL] suggestions in brackets.`,
  },

  // ── Instagram ─────────────────────────────────────────────────────────────
  {
    id: "ig_caption",
    name: "Viral Caption Generator",
    description: "Engaging captions with perfect formatting",
    category: "instagram",
    icon: "instagram",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Post Topic / Description",
    inputPlaceholder: "e.g. Sunrise hike in the mountains",
    buildPrompt: (topic) =>
      `Write 3 viral Instagram caption variations for: "${topic}".
Each caption should have:
- Hook in the first line (stops the scroll)
- Emotional storytelling body (3-5 lines)
- Line breaks for readability
- 3-5 relevant emojis placed naturally (not at start/end of every line)
- CTA (call to action) at the end
- Caption length: 150-300 words
Clearly label CAPTION 1, CAPTION 2, CAPTION 3.`,
  },
  {
    id: "ig_hashtags",
    name: "Viral Hashtag Generator",
    description: "Categorized hashtags: Trending, Medium, Niche",
    category: "instagram",
    icon: "pound",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Post Topic / Niche",
    inputPlaceholder: "e.g. travel photography, fashion, fitness",
    buildPrompt: (topic) =>
      `Generate a complete Instagram hashtag strategy for: "${topic}".
Provide 30 hashtags categorized:
TRENDING (10): Popular hashtags (1M-10M posts) for maximum reach
MEDIUM (10): Mid-size hashtags (100K-1M posts) for targeted reach  
NICHE (10): Small hashtags (10K-100K posts) for community engagement
Format as ready-to-copy groups. Add brief strategy tip at the end.`,
  },
  {
    id: "ig_bio",
    name: "Smart Bio Generator",
    description: "Niche-specific bio with personality",
    category: "instagram",
    icon: "account-edit-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Your Niche / Profession",
    inputPlaceholder: "e.g. fitness coach, travel blogger, chef",
    extraLabel: "Username / Name",
    extraPlaceholder: "e.g. @piyush.creates",
    buildPrompt: (niche, extra) =>
      `Create 3 Instagram bio variations for a ${niche} creator${extra ? ` named ${extra}` : ""}.
Each bio should be:
- Under 150 characters
- Include niche keyword naturally
- Have a clear value proposition
- Include 1-2 relevant emojis
- End with a call-to-action or link hint
- Sound authentic, not generic
Label as BIO 1, BIO 2, BIO 3.`,
  },
  {
    id: "ig_reel_hook",
    name: "Reel Hook Generator",
    description: "First 3-second attention grabbers",
    category: "instagram",
    icon: "play-circle-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Reel Topic / Niche",
    inputPlaceholder: "e.g. morning routine, cooking recipe reveal",
    buildPrompt: (topic) =>
      `Generate 15 powerful Instagram Reel hooks (first 3-second openers) for: "${topic}".
Mix these hook types:
- Question hooks ("Did you know...?")
- Statement hooks ("Nobody talks about this...")
- Challenge hooks ("Try this for 7 days...")
- Shock hooks ("I was WRONG about...")
- Curiosity hooks ("Here's what happened when I...")
Keep each hook under 10 words. List clearly numbered. Add brief note on why each type works.`,
  },
  {
    id: "ig_reel_ideas",
    name: "Reel Ideas Generator",
    description: "Trending concepts with audio suggestions",
    category: "instagram",
    icon: "filmstrip",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Your Niche / Content Theme",
    inputPlaceholder: "e.g. food blogging, fitness, photography tips",
    buildPrompt: (niche) =>
      `Generate 10 viral Instagram Reel ideas for a "${niche}" creator.
For each idea:
- Reel concept title
- Hook (first frame description)
- Visual concept (transitions, text overlays, filming style)
- Trending audio style suggestion (upbeat, lo-fi, trending sound type)
- Why it will go viral (algorithm + engagement reason)
Format clearly numbered with sections.`,
  },

  // ── Advanced ──────────────────────────────────────────────────────────────
  {
    id: "viral_score",
    name: "Viral Score Analyzer",
    description: "Evaluate content strength out of 100",
    category: "advanced",
    icon: "chart-bar",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Title / Idea to Analyze",
    inputPlaceholder: "e.g. I Tried 30 Days of Cold Showers",
    buildPrompt: (content) =>
      `Analyze the viral potential of this YouTube/Instagram content idea: "${content}"
Give a VIRAL SCORE out of 100.

Score breakdown (each out of 20):
1. Hook Strength: How well it grabs attention
2. Curiosity Gap: How much it makes people want to know more
3. Emotional Trigger: Fear, desire, humor, inspiration level
4. SEO Potential: Searchability and discoverability
5. Shareability: How likely people are to share it

Total Score: X/100
Verdict: [Weak/Average/Good/Viral/Explosive]

3 specific improvements to increase the score.
Rewritten version with improvements applied.`,
  },
  {
    id: "upload_time",
    name: "Best Upload Time",
    description: "Optimal posting times for your audience",
    category: "advanced",
    icon: "clock-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Your Niche & Target Audience",
    inputPlaceholder: "e.g. tech tutorials, Indian student audience",
    buildPrompt: (niche) =>
      `Based on "${niche}" content and audience, provide upload time recommendations.

For YouTube:
- Best days to upload (ranked 1-7)
- Best time slots with timezone (specify Indian and global times)
- Worst times to avoid
- Weekend vs weekday strategy

For Instagram:
- Best days for Reels
- Best times for Feed posts vs Stories
- Peak engagement windows

Include: Why these times work for this specific niche, and a weekly posting schedule template.`,
  },
  {
    id: "content_calendar",
    name: "Content Calendar",
    description: "7-day or 30-day content plan grid",
    category: "advanced",
    icon: "calendar-month-outline",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Your Niche",
    inputPlaceholder: "e.g. personal finance, travel vlogging",
    extraLabel: "Duration",
    extraPlaceholder: "7 days or 30 days",
    buildPrompt: (niche, duration) =>
      `Create a ${duration || "7-day"} content calendar for a "${niche}" creator.

For each day include:
- Platform (YouTube / Instagram / Both)
- Content type (Video, Short, Reel, Post, Story)
- Topic/Title idea
- Content format (Tutorial, Vlog, List, Story, Review)
- Best posting time

Organize in a clear table/grid format. 
Add: Monthly theme, content pillars used, and repurposing tips.`,
  },
  {
    id: "trending_topics",
    name: "Trending Topic Finder",
    description: "Niche-based trend simulation",
    category: "advanced",
    icon: "trending-up",
    iconSet: "MaterialCommunityIcons",
    inputLabel: "Your Niche",
    inputPlaceholder: "e.g. cryptocurrency, health & wellness",
    buildPrompt: (niche) =>
      `Identify the top trending topics and content opportunities for "${niche}" creators right now in 2024-2025.

1. TOP 5 TRENDING TOPICS: What's blowing up right now
2. EMERGING TRENDS: What's about to trend in next 30-60 days
3. EVERGREEN OPPORTUNITIES: Topics always searched but underserved
4. CONTROVERSY/DEBATE TOPICS: High engagement, comment-driving topics (use carefully)
5. SEASONAL OPPORTUNITIES: Upcoming events/seasons to leverage

For each: explain WHY it's trending and HOW to create content around it.`,
  },
  {
    id: "competitor_analysis",
    name: "Competitor Analysis",
    description: "Strategic insights from competitor research",
    category: "advanced",
    icon: "account-search-outline",
    iconSet: "MaterialCommunityIcons",
    proOnly: true,
    inputLabel: "Competitor Channel/Account Name",
    inputPlaceholder: "e.g. MrBeast, Carry Minati, @NikkieTutorials",
    extraLabel: "Your Niche",
    extraPlaceholder: "e.g. entertainment, beauty tutorials",
    buildPrompt: (competitor, niche) =>
      `Analyze "${competitor}" as a competitor for a creator in the "${niche || "same"}" niche.

1. CONTENT STRATEGY ANALYSIS:
   - Types of content they create (formats, styles, topics)
   - Upload frequency and consistency pattern
   - What makes their hooks effective

2. STRENGTHS to learn from:
   - Top 5 things they do exceptionally well

3. WEAKNESSES / GAPS to exploit:
   - Topics they don't cover
   - Audience needs they're not meeting
   - Content quality gaps

4. DIFFERENTIATION STRATEGY:
   - 5 specific ways you can stand out from them
   - Unique angle you can own

5. CONTENT IDEAS:
   - 10 video/reel ideas that compete with their best content but add your unique value

Make it strategic and actionable.`,
  },
];

export const YOUTUBE_TOOLS = TOOLS.filter((t) => t.category === "youtube");
export const INSTAGRAM_TOOLS = TOOLS.filter((t) => t.category === "instagram");
export const ADVANCED_TOOLS = TOOLS.filter((t) => t.category === "advanced");
