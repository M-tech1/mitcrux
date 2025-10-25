"use client";

import React, { JSX } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Logo + Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 uppercase">
              <span className="text-2xl font-bold text-slate-800">
                <span className="">Mit</span>Crux
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm">
              Delivering excellence through powerful software development,
              intelligent AI automation, and inspiring product design — all
              built to move your ideas forward.
            </p>
            <div className="grid grid-cols- md:grid-cols-5 gap-10"> </div>
            <div>
              <h4 className="text-slate-800 font-semibold mb-3">Follow Us :</h4>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-sky-500 hover:text-white transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-sky-500 hover:text-white transition"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-sky-500 hover:text-white transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Home Links */}

          <div className="hidden sm:block">
            <h4 className="text-slate-800 font-semibold mb-4">Home</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#/" className="hover:text-sky-500 transition">
                  › Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-sky-500 transition">
                  › About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-sky-500 transition">
                  › Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-500 transition">
                  › Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          {/* <div>
            <h4 className="text-slate-800 font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Building Apps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › MVP
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Digital Product
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Other…
                </a>
              </li>
            </ul>
          </div> */}

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-800 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Career
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-500 transition">
                  › Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-800 font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-sky-500 mt-0.5" />
                <div>
                  <span className="block text-slate-800 font-medium">
                    Call Us :
                  </span>
                  <span>(+234) 902-66111-64</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sky-500 mt-0.5" />
                <div>
                  <span className="block text-slate-800 font-medium">
                    Email Us :
                  </span>
                  <span>mitcrux@gmail.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-500 mt-0.5" />
                <div>
                  <span className="block text-slate-800 font-medium">
                    Address :
                  </span>
                  <span>Abuja, Nigeria</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          Copyright © Mitcrux 2025. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
