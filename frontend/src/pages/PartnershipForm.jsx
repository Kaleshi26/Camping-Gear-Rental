import React, { useState } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/bgf.jpg"; // Import your image

const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    contactNumber: "",
    partnershipType: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      title: "",
      contactNumber: "",
      partnershipType: "",
      message: "",
    });
  };

  return (
    <div
      className="w-full min-h-screen flex justify-center py-8 bg-cover bg-center bg-no-repeat bg-opacity-70"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Using imported image
    >
      <div className="max-w-[1350px] w-full px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Request a Partnership
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg backdrop-blur-md bg-opacity-60"
        >
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your title"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <label htmlFor="contactNumber" className="block text-gray-700 font-semibold mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your contact number"
              required
            />
          </div>

          {/* Type of Partnership */}
          <div className="mb-4">
            <label htmlFor="partnershipType" className="block text-gray-700 font-semibold mb-2">
              Type of Partnership
            </label>
            <select
              id="partnershipType"
              name="partnershipType"
              value={formData.partnershipType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="" disabled hidden>
                Select one
              </option>
              <option value="travel">Travel</option>
              <option value="influencer">Influencer</option>
              <option value="affiliate">Affiliate</option>
              <option value="event">Event</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Enter your message"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              Submit
            </button>
            <Link
              to="/contact"
              className="bg-white text-black border border-black py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnershipForm;
