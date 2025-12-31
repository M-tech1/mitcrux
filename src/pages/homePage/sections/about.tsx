"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import bg from "@/assets/bg.jpg";
import gms from "@/assets/about.jpg";
import gms2 from "@/assets/web.jpg";
import gms3 from "@/assets/softw.jpg";

import AnimatedButton from "@/components/buttons/animatedBtn";

export default function AboutSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-[#0b1921]/10 to-[#a2a7aa]/90"
      id="about"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Collage (spans 6 columns on lg) */}
          {/* ✅ LEFT SIDE - Simplified layout */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              {/* Top Row - Two side-by-side images */}
              <div className="flex flex-col gap-6 sm:w-1/2">
                <div className="relative w-full h-40 sm:h-44 rounded-md overflow-hidden shadow-lg">
                  <Image
                    src={gms}
                    alt="Corporate analysis meeting"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full h-40 sm:h-44 rounded-md overflow-hidden shadow-lg">
                  <Image
                    src={gms2}
                    alt="Team working together"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative flex-1 h-96 rounded-md overflow-hidden shadow-lg">
                <Image
                  src={bg}
                  alt="Professional with tablet"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Right: Text */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 responsive-title flex flex-col gap-3">
                <span className="block font-san">About Mitcrux</span>
                <span className="block text-slate-500 font-semibold text-xl md:text-2xl ">
                  Technology
                </span>
              </h2>

              <p className="mt-2 text-slate-600 leading-relaxed">
                we’re more than just a software development company we’re your
                digital transformation partner. We specialize in crafting
                powerful, scalable, and intelligent solutions that help
                businesses operate smarter, faster, and more efficiently.
              </p>

              <p className="mt-2 text-slate-600 leading-relaxed">
                From concept to deployment, we transform complex challenges into
                seamless digital experiences tailored to your goals and built
                with precision. Our work is driven by innovation, strategy, and
                an unwavering commitment to quality.
              </p>
              <a href="#contact">
                {" "}
                <AnimatedButton
                  className="mt-5"
                  text="Get Started with Us"
                  icon="→"
                  delay={1.5}
                  onClick={() => {}}
                />{" "}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
