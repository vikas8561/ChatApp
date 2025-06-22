const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { userId } = req.body;
  const chat = await Chat.findOneAndUpdate(
    { isGroupChat: false, users: { $all: [req.user._id, userId] } },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("users", "-password");
  res.json(chat);
});

router.get("/my", protect, async (req, res) => {
  const chats = await Chat.find({ users: { $in: [req.user._id] } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });
  res.json(chats);
});

module.exports = router;