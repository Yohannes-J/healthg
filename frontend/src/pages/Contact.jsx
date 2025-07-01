import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="p-6 text-gray-800">
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm">
        <img
          src={assets.contact_image}
          alt="Contact Us"
          className="w-full md:max-w-[360px]"
        />
        <div className="sm:w-1/2 space-y-4 text-gray-700">
          <p className="text-lg font-semibold">Our Address</p>
          <p className="text-gray-600">
            Woldia University, Woldia, Ethiopia
          </p>
          <p className="text-lg font-semibold">Get in Touch</p>
          <p className="text-gray-600">
            Tel: <span className="font-medium">+251-924-16-49-94</span> <br />
            Email: <span className="font-medium">yohannesjohn126@gmail.com</span>
          </p>
          <p className="text-gray-600">
            Whether you have a question about our services, need assistance, or just want to share your thoughts, we’re here to listen. Your health is our priority!
          </p>
          <p className="text-gray-600">
            Connect with us for personalized healthcare support and expert guidance. We look forward to hearing from you.
          </p>
          <button className="bg-primary text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
