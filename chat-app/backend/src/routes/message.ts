import express from "express";
import { allMessages, sendMessage } from "../controllers/message";
import { protect } from "../middleware/auth";

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

export default router;