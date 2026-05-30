import {
  Code2, Zap, Bot, Brain,
  ShieldCheck, Network, Home, GraduationCap,
  Palette, TrendingUp,
  Share2, Settings, Wrench, Lightbulb,
} from "lucide-react";

/* ── Navigation ──────────────────────────────────────────────────────────── */
export const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/about" },
  { label: "Work",     href: "/work" },
  { label: "Academy",  href: "/academy" },
  { label: "Contact",  href: "/contact" },
] as const;

/* ── Stats ───────────────────────────────────────────────────────────────── */
export const STATS = [
  { value: "5+",   label: "Years Experience" },
  { value: "40+", label: "Projects Delivered" },
  { value: "96%",  label: "Client Satisfaction" },
  { value: "4wk",  label: "Average MVP Delivery" },
] as const;

/* ── Services ────────────────────────────────────────────────────────────── */
export const SERVICES = [
  {
    id: "mvp-development",
    slug: "mvp-development",
    category: "Build",
    icon: Code2,
    title: "Rapid MVP & Software Development",
    tagline: "From idea to live product in 4 weeks",
    description:
      "AI-accelerated development that ships production-ready web apps, mobile products, and custom software faster than any traditional agency — without cutting corners.",
    accent: "#1a72d7",
    features: [
      "Custom Web Applications",
      "Mobile Apps (iOS & Android)",
      "API Design & Integration",
      "AI Feature Implementation",
      "System Architecture",
      "DevOps & CI/CD Setup",
    ],
    packages: [
      { name: "Validate Sprint",  price: "$300",      duration: "1 week",  desc: "Landing page + core feature mockup + analytics" },
      { name: "MVP Starter",      price: "$750",       duration: "2 weeks", desc: "Web app + auth + database + deployment" },
      { name: "MVP Pro",          price: "$1,800",     duration: "4 weeks", desc: "Full web + mobile + 3 features + admin panel" },
      { name: "Product Sprint",   price: "$4,200",     duration: "8 weeks", desc: "Complete platform + AI feature + CI/CD + docs" },
      { name: "Growth Retainer",  price: "$350/mo",    duration: "Ongoing", desc: "Enhancements, bug fixes, AI additions" },
    ],
  },
  {
    id: "ai-agents",
    slug: "ai-agents",
    category: "Automate",
    icon: Bot,
    title: "AI Agent Frameworks",
    tagline: "Autonomous agents that work while you sleep",
    description:
      "Design, build, and deploy custom AI agents that handle entire business workflows — customer support, sales outreach, document processing, and more — with zero human intervention.",
    accent: "#00b4d8",
    features: [
      "Customer Support Agents",
      "Sales Outreach Automation",
      "Document Processing AI",
      "HR & Onboarding Agents",
      "Research & Intel Agents",
      "IT Helpdesk Agents",
    ],
    packages: [
      { name: "Starter Agent",        price: "$900",     duration: "1 week",  desc: "Single-purpose agent + 1 integration" },
      { name: "Business Suite",        price: "$2,400",   duration: "3 weeks", desc: "3–5 agents + 3–8 integrations + dashboard" },
      { name: "Enterprise Framework",  price: "$15,000+", duration: "8 weeks", desc: "Full framework + custom LLM + ongoing ops" },
      { name: "Agent-as-a-Service",    price: "$300/mo",  duration: "Ongoing", desc: "Hosted agent, managed & maintained by Mitcrux" },
    ],
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    category: "Automate",
    icon: Zap,
    title: "AI Automation & Integration",
    tagline: "Connect your tools. Let AI decide.",
    description:
      "Smart automation pipelines that connect your existing business tools — Slack, HubSpot, WhatsApp, Shopify, Google Sheets — and layer in AI to make decisions, not just move data.",
    accent: "#438fdf",
    features: [
      "WhatsApp Business AI Bots",
      "CRM Autopilot",
      "Invoice & Finance Automation",
      "Social Media AI Engine",
      "Report Automation",
      "Email Marketing AI",
    ],
    packages: [
      { name: "Automation Starter", price: "$300",    duration: "3 days",  desc: "1 automation pipeline, 2 integrations" },
      { name: "Business Autopilot", price: "$720",    duration: "1 week",  desc: "3 pipelines + AI decision layer + monitoring" },
      { name: "Full Automation Suite", price: "$1,500", duration: "2 weeks", desc: "End-to-end business process automation" },
      { name: "Automation Subscription", price: "$120/mo", duration: "Ongoing", desc: "Monitoring, updates, and new automations" },
    ],
  },
  {
    id: "social-media",
    slug: "social-media",
    category: "Market",
    icon: Share2,
    title: "Social Media Management",
    tagline: "Grow your audience. Amplify your brand.",
    description:
      "Full-service social media management powered by AI content creation, scheduling, and performance analytics. We manage your entire digital presence — content, community, and growth — across all major platforms.",
    accent: "#f97316",
    features: [
      "Content Creation & Design",
      "Multi-Platform Scheduling",
      "Community Management",
      "Analytics & Reporting",
      "Brand Voice Strategy",
      "Paid Social Campaigns",
    ],
    packages: [
      { name: "Content Audit",   price: "$150",    duration: "1 week",  desc: "Full audit + strategy report + action plan" },
      { name: "Starter",         price: "$120/mo", duration: "Ongoing", desc: "2 platforms + 12 posts/month + basic analytics" },
      { name: "Growth",          price: "$280/mo", duration: "Ongoing", desc: "4 platforms + 30 posts/month + engagement mgmt" },
      { name: "Brand Pro",       price: "$550/mo", duration: "Ongoing", desc: "All platforms + 60 posts + paid ads + influencer" },
    ],
  },
  {
    id: "product-design",
    slug: "product-design",
    category: "Design",
    icon: Palette,
    title: "Product Design & Branding",
    tagline: "Brands that connect. Products that convert.",
    description:
      "From brand identity to full UI/UX systems — we design experiences that resonate with your audience and drive measurable business outcomes, accelerated by AI design tools.",
    accent: "#a855f7",
    features: [
      "Brand Identity Systems",
      "UI/UX Design",
      "Product Prototyping",
      "Landing Page Design",
      "Design System Creation",
      "Rebranding & Refresh",
    ],
    packages: [
      { name: "Brand Starter",    price: "$100",  duration: "3 days",  desc: "Logo + colours + typography + brand guide" },
      { name: "Full Identity",    price: "$220",  duration: "1 week",  desc: "Full identity + guidelines + social templates" },
      { name: "UI/UX Sprint",     price: "$700",  duration: "2 weeks", desc: "Full app or web UI in Figma, wireframe to hi-fi" },
      { name: "Landing Page",     price: "$550",  duration: "5 days",  desc: "High-conversion design + copy + CRO audit" },
    ],
  },
  {
    id: "networking",
    slug: "networking",
    category: "Infrastructure",
    icon: Network,
    title: "Networking & Infrastructure",
    tagline: "Enterprise-grade connectivity, secured.",
    description:
      "Design, deploy, and manage robust network and cloud infrastructures that ensure seamless connectivity, reliability, and data security across your entire organisation.",
    accent: "#10b981",
    features: [
      "Network Design & Deployment",
      "LAN/WAN Configuration",
      "Cloud Infrastructure (AWS/GCP)",
      "Network Security & Firewalls",
      "DevOps & CI/CD Pipelines",
      "24/7 Monitoring & Support",
    ],
    packages: [
      { name: "Network Audit",      price: "$200",    duration: "1 day",   desc: "Current network assessment + recommendations" },
      { name: "SME Network Setup",  price: "$600",    duration: "1 week",  desc: "LAN/WAN + security + monitoring" },
      { name: "Cloud Migration",    price: "$900",    duration: "2 weeks", desc: "AWS/GCP setup + DevOps + CI/CD" },
      { name: "Enterprise Network", price: "Custom",  duration: "Custom",  desc: "Full enterprise architecture + SLA" },
    ],
  },
  {
    id: "smart-home",
    slug: "smart-home",
    category: "IoT",
    icon: Home,
    title: "Smart Home & IoT Systems",
    tagline: "Intelligent spaces. Effortless living.",
    description:
      "Transform residences and commercial spaces with intelligent automation. We integrate smart technologies for comfort, security, energy efficiency, and centralised AI-managed control.",
    accent: "#f59e0b",
    features: [
      "Home Automation Systems",
      "Security & Surveillance AI",
      "IoT Device Integration",
      "Smart Office Solutions",
      "Energy Management",
      "Commercial IoT",
    ],
    packages: [
      { name: "Starter Home Kit",  price: "$600",    duration: "2 days",  desc: "Lighting + climate + 5 smart devices" },
      { name: "Full Smart Home",   price: "$1,800",  duration: "1 week",  desc: "Full automation + security + energy mgmt" },
      { name: "Smart Office",      price: "$2,400",  duration: "2 weeks", desc: "Commercial IoT + AI monitoring + dashboard" },
      { name: "Enterprise IoT",    price: "Custom",  duration: "Custom",  desc: "Industrial IoT + AI anomaly detection" },
    ],
  },
  {
    id: "it-training",
    slug: "it-training",
    category: "Learn",
    icon: GraduationCap,
    title: "Mitcrux Academy & IT Training",
    tagline: "Skills that build the future.",
    description:
      "Practical, hands-on training programs in AI, automation, web development, and networking — delivered online and organized physical locations, for individuals and corporate teams.",
    accent: "#ec4899",
    features: [
      "AI Agents for Business",
      "Build With Automation (n8n/Make)",
      "AdSense Mastery Course",
      "Full-Stack Dev with AI",
      "Corporate AI Workshops",
      "IT Support & Networking",
    ],
    packages: [
      { name: "AI Agents Course",        price: "$72",   duration: "4 weeks", desc: "Online cohort: build real AI agents" },
      { name: "Automation Bootcamp",     price: "$36",   duration: "2 weeks", desc: "n8n + Make.com self-paced" },
      { name: "Full-Stack Dev",          price: "$240",  duration: "12 weeks", desc: "Hybrid: online + OnSite cohort" },
      { name: "Corporate Workshop",      price: "$900",  duration: "1–2 month", desc: "On-site technology literacy for your team" },
    ],
  },
  {
    id: "it-support",
    slug: "it-support",
    category: "Support",
    icon: Wrench,
    title: "IT Support & Maintenance",
    tagline: "Keep your systems running. Always.",
    description:
      "Reliable, responsive IT support and system maintenance for businesses of all sizes. From helpdesk to infrastructure upkeep — we keep your technology running at peak performance, minimising downtime and maximising productivity.",
    accent: "#14b8a6",
    features: [
      "Helpdesk & User Support",
      "System Health Monitoring",
      "Hardware Maintenance",
      "Software Updates & Patching",
      "IT Asset Management",
      "Remote & On-site Support",
    ],
    packages: [
      { name: "One-Time Fix",     price: "$75",     duration: "Per incident", desc: "Single-session remote or on-site resolution" },
      { name: "Starter Support",  price: "$80/mo",  duration: "Ongoing",     desc: "5 support tickets/month + remote assistance" },
      { name: "Business Care",    price: "$200/mo", duration: "Ongoing",     desc: "Unlimited tickets + monitoring + monthly audit" },
      { name: "Enterprise SLA",   price: "$500/mo", duration: "Ongoing",     desc: "Priority 24/7 support + on-site + dedicated manager" },
    ],
  },
  {
    id: "ai-consulting",
    slug: "ai-consulting",
    category: "Consult",
    icon: Lightbulb,
    title: "AI Consulting & Corporate Training",
    tagline: "Transform your business with AI. Intelligently.",
    description:
      "Strategic AI consulting and hands-on corporate training that helps your organisation identify high-value AI opportunities, build internal capabilities, and deploy AI solutions that deliver measurable ROI.",
    accent: "#6366f1",
    features: [
      "AI Readiness Assessment",
      "Use Case Discovery",
      "AI Strategy Roadmap",
      "Executive AI Workshops",
      "Team Upskilling Programs",
      "Implementation Support",
    ],
    packages: [
      { name: "AI Audit",            price: "$300",   duration: "3 days",  desc: "Full AI readiness assessment + opportunity report" },
      { name: "Strategy Workshop",   price: "$900",   duration: "2 days",  desc: "Executive workshop + AI roadmap + quick wins" },
      { name: "Team Training",       price: "$1,200", duration: "1 month", desc: "AI literacy + tools training for up to 20 staff" },
      { name: "Full Transformation", price: "Custom", duration: "Ongoing", desc: "End-to-end AI adoption program + change management" },
    ],
  },
] as const;

/* ── Service categories for filter ──────────────────────────────────────── */
export const SERVICE_CATEGORIES = ["All", "Build", "Automate", "Market", "Design", "Infrastructure", "IoT", "Learn", "Support", "Consult"] as const;

/* ── Testimonials ────────────────────────────────────────────────────────── */
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Chidi Okonkwo",
    role: "Founder, PayFlowNG",
    content:
      "Mitcrux delivered our MVP in exactly 4 weeks. The AI-accelerated workflow meant we launched ahead of schedule. Their team felt like an extension of ours.",
    rating: 5,
    service: "MVP Development",
  },
  {
    id: 2,
    name: "Amaka Ezenwali",
    role: "CEO, StyleHouse Lagos",
    content:
      "The AI customer support agent they built handles 90% of our WhatsApp inquiries automatically. Our response time went from 4 hours to under 2 minutes.",
    rating: 5,
    service: "AI Agent",
  },
  {
    id: 3,
    name: "Emeka Nwachukwu",
    role: "Digital Publisher",
    content:
      "I had been rejected by AdSense 3 times before Mitcrux. Their approval sprint fixed everything I didn't know was wrong — approved in 8 days.",
    rating: 5,
    service: "AdSense Approval",
  },
  {
    id: 4,
    name: "Fatima Al-Hassan",
    role: "Operations Director, TechBridge Ltd",
    content:
      "The automation system they built for our invoice processing saves us 40 hours per week. ROI was realised within the first month.",
    rating: 5,
    service: "AI Automation",
  },
] as const;

/* ── Tech stack logos (text-based for now) ───────────────────────────────── */
export const TECH_STACK = [
  "Next.js", "React", "TypeScript", "Python", "FastAPI",
  "Node.js", "LangChain", "OpenAI", "Claude AI", "n8n",
  "AWS", "Vercel", "PostgreSQL", "Supabase", "Figma",
  "React Native", "TailwindCSS", "Docker", "GitHub Actions", "Stripe",
] as const;

/* ── Why choose us ───────────────────────────────────────────────────────── */
export const DIFFERENTIATORS = [
  {
    title: "AI-Native Delivery",
    description: "We use AI tools internally to build 60% faster than traditional agencies — passing speed and savings to you.",
    icon: Brain,
  },
  {
    title: "Fixed-Scope Packages",
    description: "No surprise invoices. Every package has a defined scope, timeline, and deliverable — agreed upfront.",
    icon: ShieldCheck,
  },
  {
    title: "Africa-First Pricing",
    description: "Global-quality work at pricing built for African businesses. World-class without the world-class bill.",
    icon: TrendingUp,
  },
  {
    title: "End-to-End Coverage",
    description: "From idea to deployment, design to automation — everything under one roof so nothing falls between the gaps.",
    icon: Settings,
  },
] as const;
