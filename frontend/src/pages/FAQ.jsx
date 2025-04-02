import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // FAQ data
  const faqs = [
    {
      question: "What types of camping gear can I rent from Campease?",
      answer:
        "We offer a wide range of quality camping gear, including tents, sleeping bags, sleeping pads, backpacks, and stoves. Check our Services section for more details!",
    },
    {
      question: "How do I book gear on your platform?",
      answer:
        "Simply visit our website, browse available gear, select your rental dates, and complete the booking process online. It’s quick and hassle-free!",
    },
    {
      question: "What are your rental rates?",
      answer:
        "Rates vary by item and rental duration. Tents start at $10/day, sleeping bags at $5/day, and backpacks at $8/day. Visit our pricing page for a full list.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify your booking up to 48 hours before the rental start date with no penalty. Contact us for assistance.",
    },
    {
      question: "Where can I pick up the gear?",
      answer:
        "Gear can be picked up at our outlets in Colombo (56/B Sir James Peris Mawatha) or Kandy (143/C Yatinuwara Weediya). See our Outlets section for maps.",
    },
    {
      question: "Is the gear cleaned before rental?",
      answer:
        "Absolutely! All gear is thoroughly cleaned and inspected between rentals to ensure safety and comfort.",
    },
    {
      question: "What if the gear gets damaged during my rental?",
      answer:
        "Minor wear is expected, but significant damage may incur a repair fee. Report any issues when returning the gear, and we’ll assess it fairly.",
    },
    {
      question: "Do you offer delivery services?",
      answer:
        "Currently, we offer pickup only at our outlets. Delivery options are in development—stay tuned!",
    },
    {
      question: "How do I contact support if I have more questions?",
      answer:
        "Reach out via our Contact Us page, email us at support@campease.com, or call 011-123-4567.",
    },
  ];

  // Toggle FAQ question
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Frequently Asked Questions
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* FAQ List */}
      <div className="bg-green-50 rounded-lg p-6">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full text-left text-base md:text-lg font-semibold text-gray-800 bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-between items-center"
              >
                {faq.question}
                <span>{openQuestion === index ? "−" : "+"}</span>
              </button>
              {openQuestion === index && (
                <div className="mt-2 p-4 bg-white rounded-lg shadow-inner text-gray-600 text-sm md:text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">
            No questions match your search. Try something else!
          </p>
        )}
      </div>

      {/* Contact Link */}
      <div className="text-center mt-6">
        <p className="text-gray-600 mb-2">
          Still have questions? We’re here to help!
        </p>
        <Link
          to="/contact"
          className="bg-white text-black border border-black py-1.5 px-3 rounded-lg font-semibold hover:bg-green-500 hover:text-white hover:border-green-500 transition duration-300 text-sm md:text-base"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default FAQ;