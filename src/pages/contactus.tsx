import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E1016] to-[#111827] flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md text-white">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6">Contact Us</h1>
          <p className="text-sm text-gray-400 mb-4">Last updated on 23-07-2024 19:48:06</p>
          <p className="text-lg text-gray-300 mb-8">You may contact us using the information below:</p>
          
          <ul className="space-y-6">
            <li className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-green-400 sm:col-span-1">Merchant Legal entity name:</span>
              <span className="text-gray-300 sm:col-span-2">AKHIL RAJU</span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-green-400 sm:col-span-1">Registered Address:</span>
              <span className="text-gray-300 sm:col-span-2">179/1 North Street, Thiruvengadam, Tamil Nadu, PIN: 627754</span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-green-400 sm:col-span-1">Operational Address:</span>
              <span className="text-gray-300 sm:col-span-2">179/1 North Street, Thiruvengadam, Tamil Nadu, PIN: 627754</span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-green-400 sm:col-span-1">Telephone No:</span>
              <span className="text-gray-300 sm:col-span-2">9361863548</span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-green-400 sm:col-span-1">E-Mail ID:</span>
              <span className="text-gray-300 sm:col-span-2">akhilrock638362@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;