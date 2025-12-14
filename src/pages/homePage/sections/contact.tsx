"use client";
import { useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          fullName: formData.fullName,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.success("Message sent successfully!");

      setFormData({
        fullName: "",
        email: "",
        company: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(
        "Failed to send message. Please try again, or try direct email & Phone"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className=" bg-[#f7f8fc] py-10 sm:px-6 p-2 mt-7 flex flex-col items-center"
      id="contact"
    >
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Get In{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-800">
            Touch
          </span>
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Ready to transform your institution with cutting-edge technology?
          Let&apos;s discuss your project requirements.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

            <div className="space-y-6 text-gray-700">
              <div>
                <p className="font-semibold flex items-center gap-2">
                  📞 <span>Phone</span>
                </p>
                <p>+234 (0) 9026611164</p>
                {/* <p>+234 (0) 9026611164</p> */}
              </div>

              <div>
                <p className="font-semibold flex items-center gap-2">
                  ✉️ <span>Email</span>
                </p>
                <p>info@mitcrux.com</p>
                <p>support@mitcrux.com</p>
              </div>

              <div>
                <p className="font-semibold flex items-center gap-2">
                  📍 <span>Address</span>
                </p>
                <p>Abuja, Nigeria</p>
              </div>

              <div>
                <p className="font-semibold flex items-center gap-2">
                  ⏰ <span>Business Hours</span>
                </p>
                <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p>Sat: 9:00 AM - 4:00 PM</p>
                <b> 24/7 customer support </b>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white sm:p-8 p-4 rounded-2xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company/Institution
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Service of Interest
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select a service</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App Development</option>
                  <option value="consulting">Tech Consulting</option>
                  <option value="uiux">UI/UX Design</option>
                  <option value="order">Others</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project requirements..."
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-800 hover:opacity-90 transition"
            >
              {loading ? "Sending..." : "📤 Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
