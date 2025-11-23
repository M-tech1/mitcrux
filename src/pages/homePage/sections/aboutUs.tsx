"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import gms from "@/assets/about.jpg";
import gms2 from "@/assets/web.jpg";

import ladyImag from "@/assets/bgNetwork.jpg";

import AnimatedButton from "@/components/buttons/animatedBtn";

export default function BusinessHero() {
  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-r from-[#0b1921]/10 to-[#a2a7aa]/99 w-full sm:p-5 p-2 "
        id="about"
      >
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white py-6 px-3 md:py-10 md:px-6"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-[#f3f4f4]/10 to-[#a2a7aa]/60 p-4 rounded-2xl">
            {/* Left column: image collage */}
            <motion.div
              className="relative flex justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="w-full max-w-md md:max-w-none md:w-[420px] relative">
                {/* Large main image */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={ladyImag}
                    alt="image"
                    className="w-full h-[420px] object-cover block rounded-2xl"
                  />
                </div>

                {/* Top-left small rounded image */}
                <div className="absolute -top-6 -left-6 w-25 h-25 rounded-xl overflow-hidden border-4 border-white shadow-md">
                  <Image src={gms} alt="about image" />
                </div>

                {/* Bottom-right small card image */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={gms2}
                    alt="about image"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Experience badge */}
                <div className="absolute -bottom-10 left-0 transform translate-y-6">
                  <div className="bg-cyan-500  text-white px-6 py-4 rounded-xl shadow-md flex items-center gap-4 min-w-[170px]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <motion.div
                      className="flex flex-col justify-center md:justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <div className="text-2xl font-bold">5+ Years</div>
                      <div className="text-sm">Industry Experience</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column: text content */}
            <motion.div
              className="pt-6 md:pt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-6xl font-extrabold text-slate-900 leading-tight sm:mt-10 mt-20">
                Mitcrux
              </h2>
              <span className="block text-slate-500 font-semibold text-l md:text-2xl ">
                Creativity, Innovation & Technology
              </span>
              <p className="mt-4 text-slate-500 max-w-xl">
                we’re more than just a software development company — we’re your
                digital transformation partner. We specialize in crafting
                powerful, scalable, and intelligent solutions that help
                businesses operate smarter, faster, and more efficiently.
              </p>

              {/* Info cards */}
              <div className="mt-8 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm p-4 flex items-start gap-4 border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-cyan-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6l4 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      Company Values
                    </div>
                    <div className="text-sm text-slate-500">
                      Bringing your ideas to live via technology...
                    </div>
                  </div>
                </div>
              </div>
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

          {/* Small adjustments for very small screens */}
          <style jsx>{`
            @media (max-width: 640px) {
              section > div > div:first-child {
                display: flex;
                justify-content: center;
              }
            }
          `}</style>
        </motion.section>
      </section>
    </>
  );
}
