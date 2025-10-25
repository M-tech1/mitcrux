"use client";

import studioBG from "@/assets/studioBG.jpg";
import ScrollIndicator from "@/components/animationEffects/scrollIndicator";
import { motion } from "framer-motion";
import Image from "next/image";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Twitter } from "lucide-react";
import AnimatedButton from "@/components/buttons/animatedBtn";
import AnimatedHeading from "@/components/animationEffects/animatedHeadline";
import AnimatedText from "@/components/animationEffects/animatedText";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden  " id="/">
      <Image
        src={studioBG}
        alt="image"
        className="absolute inset-0 bg-gradient-to-r from-[#07131A]/90 to-[#07131A]/90 -z-10 w-screen h-screen bg-cover bg-center bg-no-repeat"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07131A]/90 to-[#07131A]/90 -z-10" />

      {/* Left Vertical Text */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8 text-white">
        <span className="transform -rotate-90 text-xs tracking-[0.3em] text-cyan-400">
          Mitcrux
        </span>

        <div className=" h-16 w-[1px] bg-gray-500 " />
      </div>

      {/* Social Links */}
      <div className="absolute left-4 bottom-10 hidden lg:flex flex-col items-center gap-2 text-white">
        <a href="#" className="hover:text-cyan-400 transition">
          <Facebook />
        </a>
        <a href="#" className="hover:text-cyan-400 transition">
          <Instagram />
        </a>
        <a href="#" className="hover:text-cyan-400 transition">
          <Twitter />
        </a>

        <span className="text-xs tracking-[0.2em] rotate-90 writing-vertical mt-10">
          Follow Us
        </span>
      </div>

      {/* Main Content */}

      <div className="relative z-10 flex flex-col justify-center items-start h-full sm:px-16 px-5 lg:px-32 md:px-2 text-white">
        <div className="relative md:left-20 left-1 border-t border-l border-b border-cyan-400 sm:p-10 p-1 rounded-xl h-130 w-80 ">
          <div className="absolute top-10 sm:left-34 left-3  sm:p-6 p-1 rounded-lg shadow-lg sm:w-120 sm:h-130 ">
            <AnimatedHeading>
              <h1 className="sm:text-9xl text-7xl"> WE </h1>
              <span>IMPLEMENT</span>

              <br />
              <p className="text-cyan-400 text-[33px]">PROFESSIONAL SOFTWARE</p>
            </AnimatedHeading>

            <AnimatedText>
              <p className="text-gray-300 text-cneter">
                Delivering excellence through powerful software development,
                intelligent AI automation, and inspiring product design — all
                built to move your ideas forward.
              </p>
            </AnimatedText>
            <div className="flex flex-col sm:items-end">
              <AnimatedButton
                className="mt-5"
                text="Get Started Now"
                icon="→"
                delay={1.5}
                onClick={() => console.log("Button clicked")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-[2px] h-32 bg-gray-600 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-8 bg-cyan-400 rounded"
            animate={{
              y: [0, 100, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
