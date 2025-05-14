import React from "react";
import { Link } from "react-router-dom";
import Imageslider from "../helpers/imageslider";
import image1 from "../assets/product1.png";
import image2 from "../assets/product2.png";
import image3 from "../assets/product3.png";
import image4 from "../assets/product4.png";
import sss from "../assets/bea.jpg";
import social from "../assets/social.jpg";
import partner1 from "../assets/pat.jpeg"; // Replace with your actual partner images
import partner2 from "../assets/paat2.jpeg";
import partner3 from "../assets/pat3.jpeg";
import partner4 from "../assets/pat4.jpg";

const Offers = () => {
  const offerItems = [
    {
      id: 1,
      image: image1,
      title: "Product 1",
      description:
        "A card component has a figure, a body part, and inside the body, there are title and actions parts.",
      link: "/products",
    },
    {
      id: 2,
      image: image2,
      title: "Product 2",
      description:
        "A card component has a figure, a body part, and inside the body, there are title and actions parts.",
      link: "/products",
    },
    {
      id: 3,
      image: image3,
      title: "Product 3",
      description:
        "A card component has a figure, a body part, and inside the body, there are title and actions parts.",
      link: "/products",
    },
    {
      id: 4,
      image: image4,
      title: "Product 4",
      description:
        "A card component has a figure, a body part, and inside the body, there are title and actions parts.",
      link: "/products",
    },
  ];

  const partners = [
    { id: 1, image: partner1, name: "Partner 1" },
    { id: 2, image: partner2, name: "Partner 2" },
    { id: 3, image: partner3, name: "Partner 3" },
    { id: 4, image: partner4, name: "Partner 4" },
  ];

  return (
    <div className="w-full min-h-screen flex justify-center px-4 md:px-8">
      <div className="max-w-[1350px] w-full py-8">
        {/* Image Slider */}
        <Imageslider />

        {/* Season Offers Section */}
        <div className="w-full">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#4A3D2E] mb-6 text-center py-2">
            Season Offers
          </h1>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                {/* Weekly Offer Badge */}
                <div className="absolute top-3 left-3 bg-[#D4A017] text-[#4A3D2E] text-xs font-semibold px-2 py-1 rounded-full">
                  Weekly Offer
                </div>

                {/* Image */}
                <img className="w-full h-48 object-cover" src={item.image} alt={item.title} />

                {/* Card Body */}
                <div className="p-4 border-t border-gray-300">
                  <h2 className="text-xl font-semibold text-[#4A3D2E]">{item.title}</h2>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={item.link}
                      className="bg-white text-[#4A3D2E] border border-[#4A3D2E] py-1.5 px-3 rounded-lg font-semibold hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300 text-sm md:text-base"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WE CARE Section */}
        <div className="py-8 mt-10 bg-[#FFF9E5] px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-[#4A3D2E] mb-4">BE A CAMPER</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify mb-4">
                We prioritize the comfort, safety, and environmental sustainability of all camping
                enthusiasts. Our goal is to ensure every adventurer has access to reliable gear while
                promoting responsible outdoor activities.
              </p>
              <div className="mt-4">
                <Link
                  to="/signup"
                  className="bg-white text-[#4A3D2E] border border-[#4A3D2E] py-1.5 px-3 rounded-lg font-semibold hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300 text-sm md:text-base"
                >
                  TRY NOW
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <img src={sss} alt="WE CARE" className="rounded shadow-lg w-full h-56 md:h-72 object-cover" />
            </div>
          </div>
        </div>

        {/* Social Media Offers Section */}
        <div className="py-8 mt-10 bg-[#FFF9E5] px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <img src={social} alt="Social Media Offers" className="rounded shadow-lg w-full h-56 md:h-72 object-cover" />
            </div>
            {/* Text Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block bg-[#D4A017] text-[#4A3D2E] text-xl font-semibold px-2 py-2 rounded-full mb-2">
                TAG & WIN
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#4A3D2E] mb-4">SOCIAL MEDIA OFFERS</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
                Join the CampEase community on social media and unlock exclusive offers! Share your camping adventures, tag us, and participate in exciting giveaways to win premium gear rentals or discounts. Follow us on Facebook, Instagram, and Twitter to stay updated on the latest promotions and connect with fellow outdoor enthusiasts.
              </p>
              <div className="mt-4">
                <Link
                  to="https://www.facebook.com/share/1Ax4ejbss3/"
                  className="bg-white text-[#4A3D2E] border border-[#4A3D2E] py-1.5 px-3 rounded-lg font-semibold hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300 text-sm md:text-base"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Our Partnerships Section */}
        <div className="py-6 mt-10 bg-[#FFF9E5] px- environment-friendly camping gear rental service.4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A3D2E] mb-6 text-center">
            OUR PARTNERSHIPS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 transform transition duration-300 hover:scale-110 mx-auto"
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full rounded-full object-cover shadow-lg"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FFF9E5] rounded-lg p-4">
            <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1 text-center sm:text-left text-justify">
              At CampEase, we collaborate with leading outdoor brands and local businesses to provide high-quality, environment-friendly camping gear. Our partnerships ensure that you have access to the best equipment for your adventures while supporting sustainable practices. Join us in building a community dedicated to responsible camping and unforgettable outdoor experiences.
            </p>
            <Link
              to="/partnership-request"
              className="bg-white text-[#4A3D2E] border border-[#4A3D2E] py-1 px-4 rounded-lg font-semibold text-sm md:text-base hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition duration-300"
            >
              TRY NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;