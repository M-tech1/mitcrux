"use client";

import Image from "next/image";
import React, { JSX } from "react";
import img1 from "@/assets/bgNetwork.jpg";
import img2 from "@/assets/bg.jpg";
import webdesign from "@/assets/webDesign.jpg";
import web from "@/assets/bgpost.jpg";

export default function TheRightSoftware(): JSX.Element {
  return (
    <section className="relative bg-[#F8FAFC] py-20 " id="softwares">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-block w-14 h-[1px] bg-teal-500/40" />
            <span className="text-xs uppercase tracking-widest text-teal-600 font-medium">
              Mitcrux
            </span>
            <span className="inline-block w-14 h-[1px] bg-teal-500/40" />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            THE <span className="text-slate-400 font-light">RIGHT</span>{" "}
            SOFTWARE
          </h2>
          <p className="text-slate-500 mt-3 text-sm md:text-base">
            The right software isn’t just about code — it’s about solving real
            problems with precision, creativity, and care.
          </p>
        </div>

        {/* Block 1 */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
          {/* Image */}
          <div className="relative md:w-1/2 w-full">
            <div className="relative border-[3px] border-cyan-400 rounded-lg overflow-hidden">
              <Image
                src={web}
                alt="networks"
                width={600}
                height={400}
                className="object-cover w-full h-full bg-amber-100/50"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white shadow-md rounded-full w-20 h-20 flex items-center justify-center border border-gray-200">
              <span className="text-xs text-slate-700 text-center font-medium px-2">
                CRUX
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 w-full" id="article1">
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
              ENGINEERED FOR YOUR SUCCESS
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">
              Building on a clear understanding of your goals, designed for
              seamless user experience, and engineered for performance and
              scalability. At its core, the right software adapts to your needs,
              grows with your vision, and empowers you to do more with less
              effort. We believe technology should simplify life, not complicate
              it — that’s why we create solutions that are smart, reliable, and
              built to last.
            </p>
            <a
              href="#article2"
              className="inline-flex items-center gap-2 bg-cyan-600 text-white text-sm px-5 py-2 rounded-full shadow hover:bg-cyan-700 transition"
            >
              Read More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Block 2 (reverse layout) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          {/* Image */}
          <div className="relative md:w-1/2 w-full">
            <div className="relative border-[3px] border-cyan-400 rounded-lg overflow-hidden">
              <Image
                src={img2}
                alt="Sturnis365"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white shadow-md rounded-full w-20 h-20 flex items-center justify-center border border-gray-200">
              <span className="text-xs text-slate-700 text-center font-medium px-2">
                Scrum
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 w-full" id="article2">
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
              TAILORED SOLUTIONS THAT DELIVER
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">
              The right software is crafted — not copied. It’s built to fit your
              business, your users, and your vision. At our core, we believe
              every organization deserves solutions designed specifically for
              its unique challenges and goals. That’s why we don’t just write
              code — we collaborate, listen, and innovate. From concept to
              launch, we create custom software that aligns with your workflow,
              scales with your growth, and delivers lasting value. Whether you
              need a web platform, mobile app, or enterprise system, we build
              solutions that work exactly the way you need them to — reliable,
              efficient, and ready for the future.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-cyan-600 text-white text-sm px-5 py-2 rounded-full shadow hover:bg-cyan-700 transition"
            >
              Reach Out
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
