import express from "express";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.route("/")
  .get(protect, fetchChats)
  .post(protect, accessChat);
router.route("/group").post(protect, createGroupChat);
router.route("/group/rename").put(protect, renameGroup);
router.route("/group/add").put(protect, addToGroup);
router.route("/group/remove").put(protect, removeFromGroup);

export default router;