import express from "express";
import {createReview,getReviews,updateReview,deleteReview,} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
