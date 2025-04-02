import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: "",
  });

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Handle form submission for new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
      rating: parseInt(e.target.rating.value),
    };

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]); // Add new review to the top
        alert("Review submitted successfully!");
        e.target.reset();
      } else {
        alert("Error submitting review.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting review.");
    }
  };

  // Handle edit button click
  const handleEdit = (review) => {
    setEditingReview(review._id);
    setFormData({
      name: review.name,
      email: review.email,
      subject: review.subject,
      message: review.message,
      rating: review.rating,
    });
  };

  // Handle form input change for editing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update review
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(
          reviews.map((review) =>
            review._id === id ? updatedReview : review
          )
        );
        setEditingReview(null);
        alert("Review updated successfully!");
      } else {
        alert("Error updating review.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating review.");
    }
  };

  // Handle delete review
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setReviews(reviews.filter((review) => review._id !== id));
          alert("Review deleted successfully!");
        } else {
          alert("Error deleting review.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting review.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Customer Reviews
      </h1>

      {/* Get in Touch Form */}
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">GET IN TOUCH</h2>
        <form
          className="max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">SUBJECT</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter your subject"
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">MESSAGE</label>
            <textarea
              name="message"
              placeholder="Enter your message here..."
              className="w-full p-3 bg-gray-100 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">RATING</label>
            <select
              name="rating"
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            SUBMIT
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="bg-green-50 rounded-lg p-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-auto mb-6"
            >
              {editingReview === review._id ? (
                // Edit Form
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">NAME</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">EMAIL</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">SUBJECT</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">MESSAGE</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-100 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">RATING</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select a rating</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(review._id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Review
                <div className="flex flex-col items-center">
                  <p className="text-gray-600 text-sm md:text-base text-center italic mb-4">
                    "{review.message}"
                  </p>
                  <div className="flex mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-800 font-semibold text-sm md:text-base">
                    BY {review.name.toUpperCase()}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(review)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">
            No reviews yet. Be the first to share your experience!
          </p>
        )}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="bg-white text-black border border-black py-2 px-4 rounded-lg font-semibold hover:bg-green-500 hover:text-white hover:border-green-500 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reviews;