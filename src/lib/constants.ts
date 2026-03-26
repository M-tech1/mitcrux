import {
  Code2, Zap, Bot, Brain,
  ShieldCheck, Network, Home, GraduationCap,
  Palette, TrendingUp,
  DollarSign, Settings,
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
    id: "adsense-approval",
    slug: "adsense-approval",
    category: "Monetise",
    icon: DollarSign,
    title: "AdSense & Monetisation",
    tagline: "Get approved. Start earning.",
    description:
      "The only end-to-end AdSense approval service in Africa. We audit your site, fix content and technical issues with AI, and get you approved — or we resubmit until you are.",
    accent: "#22d3ee",
    features: [
      "Full Site AdSense Audit",
      "AI Content Rewriting",
      "Policy Compliance Fixes",
      "Technical SEO Repair",
      "Multi-Network Onboarding",
      "Ad Revenue Optimisation",
    ],
    packages: [
      { name: "Audit Report",          price: "$30",    duration: "48 hrs",     desc: "Full AdSense readiness report + fix list" },
      { name: "Approval Sprint",        price: "$180",   duration: "5–7 days",   desc: "Audit + content + fixes + 1 submission" },
      { name: "Approval Guarantee",     price: "$300",   duration: "Until done", desc: "3 resubmissions + support until approved" },
      { name: "Revenue Management",     price: "$90/mo", duration: "Ongoing",    desc: "Ad placement + RPM optimisation" },
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
] as const;

/* ── Service categories for filter ──────────────────────────────────────── */
export const SERVICE_CATEGORIES = ["All", "Build", "Automate", "Monetise", "Design", "Infrastructure", "IoT", "Learn"] as const;

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
