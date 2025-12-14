import { Boxes, BrainCircuit, LayoutDashboard } from "lucide-react";

export default function Services() {
  return (
    <>
      <section className="relative  text-gray-800  bg-blue-50" id="services">
        <main className="container mx-auto px-6 md:px-12 py-20">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="inline-block w-14 h-[1px] bg-cyan-400" />
              <p className="text-sm font-semibold text-cyan-400 mb-2">
                Mitcrux
              </p>
              <span className="inline-block w-14 h-[1px] bg-teal-400/30" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              CORE <span className="text-gray-600 font-medium">Services</span>
            </h2>
            <p className="text-gray-500 text-base">
              Services we provide to our clients.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Service 1 */}
            <div className="text-center px-4">
              {/* Icon Circle with dots */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                {/* Decorative dots */}
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-cyan-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400" />
                {/* Main circle */}
                <div className="w-full h-full rounded-full border-4 border-cyan-200 flex items-center justify-center bg-white">
                  <Boxes className="w-16 h-16  text-cyan-400 " />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4">
                Professional Softwares Development
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                We build powerful, scalable, and intelligent software solutions
                that help businesses operate smarter, faster, and more
                efficiently. Our team of experienced developers transforms
                complex business challenges into seamless digital experiences —
                tailored to your goals and built with precision.
              </p>

              <ul className="text-gray-600 leading-relaxed text-sm  list-disc pl-6 space-y-2 text-left mt-3 hidden md:block">
                <li>
                  <strong>Custom Software Development</strong> – Tailored
                  software solutions designed to meet your unique business
                  needs, from concept to deployment.
                </li>
                <li>
                  <strong>Web Application Development</strong> – Build secure,
                  high-performance, and scalable web applications that drive
                  growth.
                </li>
                <li>
                  <strong>Mobile App Development</strong> – Create engaging and
                  user-friendly mobile apps for Android and iOS platforms.
                </li>

                <li>
                  <strong>System Integration & API Development</strong> –
                  Connect tools and platforms seamlessly to enhance productivity
                  and data flow.
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="text-center px-4">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-cyan-400" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400" />{" "}
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
                <div className="w-full h-full rounded-full border-4 border-cyan-200 flex items-center justify-center bg-white">
                  <LayoutDashboard className="w-16 h-16  text-cyan-400 " />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4">
                Product Design & Branding
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                Your brand is more than just visuals — it’s an experience, a
                story, and a promise to your customers. We create meaningful
                product designs and powerful brand identities that connect
                emotionally, stand out visually, and inspire trust.
              </p>

              <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-2 text-sm text-left mt-3 hidden md:block">
                <li>
                  <strong>Brand Identity Design</strong> – Create timeless
                  visual identities that reflect your brand’s personality and
                  values.
                </li>
                <li>
                  <strong>UI/UX Design</strong> – Design intuitive,
                  user-centered interfaces that deliver exceptional user
                  experiences.
                </li>
                <li>
                  <strong>Product Prototyping & Wireframing</strong> – Transform
                  ideas into functional, interactive prototypes that bring
                  clarity and direction.
                </li>

                <li>
                  <strong>Rebranding & Brand Refresh</strong> – Redefine and
                  modernize your brand while staying true to your identity.
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="text-center px-4">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400" />{" "}
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-cyan-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
                <div className="w-full h-full rounded-full border-4 border-cyan-200 flex items-center justify-center bg-white">
                  <BrainCircuit className="w-16 h-16  text-cyan-400 " />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4">
                AI Automations & Support Engineering
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                Empower your business with intelligent automation and reliable
                technical support. We integrate Artificial Intelligence and
                automation engineering to streamline operations, reduce manual
                tasks, and enhance performance across your systems.
              </p>
              <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-2 text-sm text-left mt-3 hidden md:block">
                <li>
                  <strong>AI-Powered Process Automation</strong> – Automate
                  repetitive workflows with AI to boost accuracy and speed.
                </li>
                <li>
                  <strong>Chatbots & Virtual Assistants</strong> – Improve
                  customer experience through intelligent AI-driven chat
                  support.
                </li>
                <li>
                  <strong>Predictive Analytics & Data Insights</strong> – Use AI
                  to uncover insights and make data-driven business decisions.
                </li>
                <li>
                  <strong>Support System Engineering</strong> – Ensure seamless
                  system operations through reliable engineering and
                  maintenance.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
