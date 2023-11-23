import express from "express";
import { allUsers, authUser, registerUser } from "../controllers/user";
import { protect } from "../middleware/auth";

const router = express.Router();

router.route("/")
  .get(protect, allUsers);

router.route("/register")
  .post(registerUser);

router.route("/auth")
  .post(authUser);

export default router;