console.log("AUTH ROUTES FILE LOADED");
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/testpost", (req, res) => {
  console.log("POST TEST HIT");

  res.json({
    success: true,
    message: "POST Working",
  });
});

export default router;
