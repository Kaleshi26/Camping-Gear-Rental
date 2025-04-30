import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Added for animations
import heroImage from "../assets/alt.jpg";
import storyImage from "../assets/ss.jpg";
import careimage from "../assets/WECARE.png";
import outlet from "../assets/out1.png";
import outlet2 from "../assets/out2.png";
import img1 from "../assets/image7.png";
import img2 from "../assets/image8.png";
import img3 from "../assets/image10.png";
import img4 from "../assets/image11.png";
import userAvatar from "../assets/heroimage.png";
import AboutUsBackground from "../assets/aboutus-background.jpg"; // New background image

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto pt-8">
      {/* Header Section with Full-Width Background */}
      <section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center rounded-2xl shadow-xl">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${AboutUsBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.1)", // Slight scale to avoid edge gaps
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.h1
          className="relative text-2xl md:text-5xl font-bold text-white text-center px-4 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          GEAR UP FOR GREAT OUTDOORS
        </motion.h1>
      </section>

      {/* Story Section */}
      <div className="py-6 mt-10 bg-[#FFF9E5] px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="w-full lg:w-1/2">
            <img src={storyImage} alt="CAMPEASE" className="rounded shadow-lg w-full" />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#4A3D2E]">
              HELLO, WE ARE CAMPEASE
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
              Welcome to our Website, where camping adventures meet convenience! We're an outdoor rental service connecting
              enthusiasts with top-notch gear like tents, sleeping bags, and stoves while empowering equipment owners
              to earn extra income. Our platform replaces outdated manual bookings with a sleek online solution,
              making renting easy, efficient, and hassle-free for all.
            </p>
          </div>
        </div>
      </div>

      {/* We Care Section */}
      <div className="py-6 mt-10 bg-[#FFF9E5] px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#4A3D2E]">
              WE CARE
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify mb-3">
              We prioritize the comfort, safety, and environmental sustainability of all camping enthusiasts.
              Our goal is to ensure every adventurer has access to reliable gear while promoting responsible outdoor activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="bg-white text-[#4A3D2E] border border-[#4A3D2E] py-1.5 px-3 rounded-lg font-semibold hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300 text-sm md:text-base"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="bg-white text-[#4A3D2E] border border-[#4A3D2E] py-1.5 px-3 rounded-lg font-semibold hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300 text-sm md:text-base"
              >
                FAQ
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <img src={careimage} alt="WE CARE" className="rounded shadow-lg w-full" />
          </div>
        </div>
      </div>

      {/* Outlets Section */}
      <div className="py-6 mt-10 bg-[#FFF9E5] px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#4A3D2E]">
          OUR OUTLETS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              img: outlet,
              address: "56/B Sir James Peris Mawatha, Colombo",
              phone: "011-9875664",
              link: "https://www.google.com/maps/place/Belmio+Pizza/",
            },
            {
              img: outlet2,
              address: "143/C Yatinuwara Weediya, Kandy",
              phone: "081-9875664",
              link: "https://www.google.com/maps/place/Belmio+Pizza/",
            },
          ].map((outlet, index) => (
            <a
              key={index}
              href={outlet.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative bg-black text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <img src={outlet.img} alt="Outlet" className="w-full h-auto object-cover opacity-70" />
              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 p-3">
                <p className="text-base md:text-xl font-bold">{outlet.address}</p>
                <p className="mt-1 text-base md:text-xl font-bold">CALL NOW – {outlet.phone}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="py-6 mt-10 bg-[#FFF9E5] px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#4A3D2E]">
          OUR SERVICES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/services/gear"
            className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 bg-black text-white"
          >
            <img src={img1} alt="Fast Delivery" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-center p-4">
              <p className="text-base md:text-xl font-bold">RENT QUALITY TENTS</p>
            </div>
          </Link>

          <Link
            to="/service/gear"
            className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 bg-black text-white"
          >
            <img src={img2} alt="Healthy Foods" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-center p-4">
              <p className="text-base md:text-xl font-bold">RENT BAGS AND PADS</p>
            </div>
          </Link>

          <Link to="/service/gear">
            <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 bg-black text-white">
              <img src={img3} alt="Reservation" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-center p-4">
                <p className="text-base md:text-xl font-bold">RENT QUALITY BACKPACK</p>
              </div>
            </div>
          </Link>

          <Link
            to="/services/outdoors"
            className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 bg-black text-white"
          >
            <img src={img4} alt="Food Truck" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-center p-4">
              <p className="text-base md:text-xl font-bold">GREAT OUTDOORS</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-6 mt-10 bg-[#FFF9E5] px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#4A3D2E]">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <div className="flex flex-col items-center">
          {/* Review Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex flex-col items-center">
              {/* User Avatar */}
              <img
                src={userAvatar}
                alt="User Avatar"
                className="w-16 h-16 rounded-full mb-4"
              />
              {/* Review Text */}
              <p className="text-gray-600 text-sm md:text-base text-center italic mb-4">
                "Rented a tent and sleeping bag for a weekend trip, and the experience was fantastic! The gear was in great condition, and pickup in Colombo was seamless. Staff were super helpful and even gave us tips for our campsite. Highly recommend Campease for any outdoor adventure!"
              </p>
              {/* Star Rating */}
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#D4A017]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Reviewer Name */}
              <p className="text-[#4A3D2E] font-semibold text-sm md:text-base">
                BY SARAH M
              </p>
            </div>
          </div>
          {/* See More Reviews Button */}
          <Link
            to="/reviews"
            className="mt-6 bg-white text-[#4A3D2E] border border-[#4A3D2E] py-2 px-4 rounded-lg font-semibold hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300 text-sm md:text-base"
          >
            See More Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;