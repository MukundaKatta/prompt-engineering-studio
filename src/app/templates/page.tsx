"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import TemplateCard from "@/components/TemplateCard";
import { Template } from "@/types";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_TEMPLATES: Template[] = [
  {
    id: "t1",
    title: "Code Review Assistant",
    description:
      "Analyzes code for bugs, performance issues, and best practices. Provides structured feedback with severity levels.",
    category: "Code Generation",
    content:
      "Review the following {{language}} code and provide feedback on:\n1. Bugs or potential issues\n2. Performance optimizations\n3. Best practice violations\n4. Security concerns\n\nCode:\n```{{language}}\n{{code}}\n```\n\nProvide feedback in a structured format with severity levels (Critical, Warning, Info).",
    systemPrompt: "You are a senior software engineer performing a thorough code review.",
    variables: [
      { key: "language", value: "TypeScript" },
      { key: "code", value: "" },
    ],
    author: "PromptStudio Team",
    usageCount: 1240,
    rating: 4.8,
    tags: ["code", "review", "quality"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Blog Post Generator",
    description:
      "Generates engaging blog posts with SEO optimization, proper headings, and a compelling narrative structure.",
    category: "Writing",
    content:
      "Write a comprehensive blog post about {{topic}}.\n\nTarget audience: {{audience}}\nTone: {{tone}}\nWord count: approximately {{word_count}} words\n\nInclude:\n- Engaging introduction with a hook\n- 3-5 main sections with H2 headings\n- Practical examples or case studies\n- Conclusion with call to action\n- SEO-friendly meta description (max 160 chars)",
    systemPrompt: "You are an expert content writer specializing in engaging, SEO-optimized blog content.",
    variables: [
      { key: "topic", value: "" },
      { key: "audience", value: "developers" },
      { key: "tone", value: "professional yet approachable" },
      { key: "word_count", value: "1500" },
    ],
    author: "PromptStudio Team",
    usageCount: 890,
    rating: 4.6,
    tags: ["writing", "blog", "SEO"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Data Analysis Report",
    description:
      "Analyzes datasets and produces insights with statistical summaries and visualization recommendations.",
    category: "Analysis",
    content:
      "Analyze the following {{data_type}} data and provide:\n\n1. Executive Summary (2-3 sentences)\n2. Key Findings (top 5)\n3. Statistical Analysis\n4. Trends and Patterns\n5. Recommendations\n6. Suggested Visualizations\n\nData:\n{{data}}\n\nContext: {{context}}",
    systemPrompt: "You are a data scientist with expertise in statistical analysis and data visualization.",
    variables: [
      { key: "data_type", value: "sales" },
      { key: "data", value: "" },
      { key: "context", value: "quarterly business review" },
    ],
    author: "PromptStudio Team",
    usageCount: 670,
    rating: 4.7,
    tags: ["data", "analysis", "statistics"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t4",
    title: "Conversational AI Persona",
    description:
      "Creates a detailed AI persona for chatbot applications with personality traits and response guidelines.",
    category: "Chat & Conversation",
    content:
      "Create a detailed AI persona specification for a {{persona_type}} chatbot:\n\n1. Personality Profile\n   - Core traits\n   - Communication style\n   - Knowledge domains\n\n2. Response Guidelines\n   - Tone and language rules\n   - Topics to avoid\n   - Escalation triggers\n\n3. Sample Conversations\n   - Greeting\n   - FAQ handling\n   - Edge case handling\n\nTarget platform: {{platform}}\nTarget audience: {{audience}}",
    systemPrompt: "You are a UX designer specializing in conversational AI design.",
    variables: [
      { key: "persona_type", value: "customer support" },
      { key: "platform", value: "web chat" },
      { key: "audience", value: "enterprise B2B" },
    ],
    author: "PromptStudio Team",
    usageCount: 450,
    rating: 4.5,
    tags: ["chatbot", "persona", "UX"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t5",
    title: "API Documentation Writer",
    description:
      "Generates comprehensive API documentation from endpoint specifications with examples and error codes.",
    category: "Code Generation",
    content:
      "Generate comprehensive API documentation for the following endpoint:\n\nEndpoint: {{method}} {{path}}\nDescription: {{description}}\n\nInclude:\n1. Overview and purpose\n2. Request parameters (path, query, body) with types\n3. Response schema with examples\n4. Error codes and handling\n5. cURL example\n6. SDK examples (JavaScript, Python)\n7. Rate limiting info\n8. Authentication requirements",
    systemPrompt: "You are a technical writer specializing in API documentation. Follow OpenAPI standards.",
    variables: [
      { key: "method", value: "POST" },
      { key: "path", value: "/api/v1/users" },
      { key: "description", value: "Creates a new user account" },
    ],
    author: "PromptStudio Team",
    usageCount: 780,
    rating: 4.9,
    tags: ["API", "documentation", "developer"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t6",
    title: "Creative Story Starter",
    description:
      "Generates unique story openings with world-building elements, character introductions, and plot hooks.",
    category: "Creative",
    content:
      "Write an engaging story opening (500 words) in the {{genre}} genre.\n\nSetting: {{setting}}\nProtagonist trait: {{protagonist_trait}}\nConflict type: {{conflict}}\n\nRequirements:\n- Start with action or dialogue (no exposition dumps)\n- Introduce the protagonist within the first paragraph\n- Establish the world through showing, not telling\n- End with a hook that compels the reader to continue\n- Use vivid sensory details",
    systemPrompt: "You are an award-winning fiction writer with a talent for captivating openings.",
    variables: [
      { key: "genre", value: "sci-fi" },
      { key: "setting", value: "a space station orbiting a dying star" },
      { key: "protagonist_trait", value: "rebellious engineer" },
      { key: "conflict", value: "person vs. system" },
    ],
    author: "PromptStudio Team",
    usageCount: 320,
    rating: 4.4,
    tags: ["creative", "fiction", "writing"],
    createdAt: new Date().toISOString(),
  },
];

const CATEGORIES = [
  "All",
  "Code Generation",
  "Writing",
  "Analysis",
  "Chat & Conversation",
  "Data",
  "Creative",
];

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = DEMO_TEMPLATES.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: Template) => {
    // In production, this would load the template into the editor
    router.push("/editor");
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Template Marketplace"
        subtitle="Browse and use community prompt templates"
      />

      <div className="p-6">
        {/* Search & Filter */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="h-10 w-full rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-gray-500" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  activeCategory === cat
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={handleUseTemplate}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex h-48 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
            <p className="text-sm text-gray-500">
              No templates match your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
