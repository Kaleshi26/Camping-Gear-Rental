import Review from "../models/reviewModel.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;
    const newReview = new Review({ name, email, subject, message, rating });
    await newReview.save();
    // Remove toast and use console.log to indicate success
    console.log("Review created successfully!");
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedReview) {
      // Replace toast with console.log
      console.warn("Review not found");
      return res.status(404).json({ message: "Review not found" });
    }
    // Replace toast with console.log
    console.log("Review updated successfully!");
    res.status(200).json(updatedReview);
  } catch (error) {
    // Replace toast with console.error
    console.error("Error updating review:", error.message);
    res.status(500).json({ message: "Error updating review", error });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      // Replace toast with console.log
      console.warn("Review not found");
      return res.status(404).json({ message: "Review not found" });
    }
    // Replace toast with console.log
    console.log("Review deleted successfully!");
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    // Replace toast with console.error
    console.error("Error deleting review:", error.message);
    res.status(500).json({ message: "Error deleting review", error });
  }
};
