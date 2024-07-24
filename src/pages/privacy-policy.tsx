import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E1016] to-[#111827] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400">Privacy Policy</h1>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Information We Collect</h2>
            <p className="text-gray-300">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">How We Use Your Information</h2>
            <p className="text-gray-300">
              We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Sharing of Information</h2>
            <p className="text-gray-300">
              We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analysis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational measures to protect the security of your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Your Rights</h2>
            <p className="text-gray-300">
              You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2">
              <li>E-Mail: akhilrock638362@gmail.com</li>
              <li>Phone: 9361863548</li>
              <li>Address: 179/1 North Street, Thiruvengadam, Tamil Nadu, PIN: 627754</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;