"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {/* Last updated: {new Date().toLocaleDateString()} */}
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </header>

        {/* Content */}
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-gray-700">
            Welcome to our platform. These Terms and Conditions govern your
            access to and use of our software products, services, websites, and
            applications (collectively, the “Services”). By accessing or using
            our Services, you agree to be bound by these Terms.
          </p>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              1. About the Company
            </h2>
            <p className="text-gray-700">
              We are a technology-driven company focused on building secure,
              scalable, and reliable digital solutions. Our Services are
              designed to support businesses and individuals through modern
              software, cloud-based tools, and data-driven systems.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              2. Use of Our Services
            </h2>
            <p className="text-gray-700">
              You agree to use our Services only for lawful purposes and in
              compliance with all applicable laws and regulations. You must not
              misuse, interfere with, or attempt to gain unauthorized access to
              any part of our systems, infrastructure, or data.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              3. Accounts and Security
            </h2>
            <p className="text-gray-700">
              When creating an account, you are responsible for maintaining the
              confidentiality of your login credentials. You agree to notify us
              immediately of any unauthorized access or security breach related
              to your account.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              4. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All content, software, code, designs, trademarks, and
              documentation provided through our Services are the intellectual
              property of the company or its licensors. You may not copy,
              modify, distribute, or reverse engineer any part of our Services
              without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              5. Data and Privacy
            </h2>
            <p className="text-gray-700">
              We take data protection and privacy seriously. Our collection and
              use of personal data are governed by our Privacy Policy. By using
              our Services, you acknowledge and agree to how we handle data in
              accordance with applicable data protection laws.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              6. Service Availability
            </h2>
            <p className="text-gray-700">
              While we strive to provide reliable and uninterrupted Services, we
              do not guarantee that the Services will always be available or
              error-free. We may modify, suspend, or discontinue parts of the
              Services to improve performance, security, or functionality.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, the company shall not be
              liable for any indirect, incidental, or consequential damages
              arising from your use of or inability to use the Services,
              including loss of data, revenue, or business opportunities.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              8. Changes to These Terms
            </h2>
            <p className="text-gray-700">
              We may update these Terms from time to time to reflect changes in
              our Services, technology, or legal requirements. Continued use of
              the Services after updates means you accept the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              9. Contact Information
            </h2>
            <p className="text-gray-700">
              If you have any questions about these Terms and Conditions, please
              contact our support or legal team through the official channels
              provided on our website.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
