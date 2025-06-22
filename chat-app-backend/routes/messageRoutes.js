const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { content, chatId, viewOnce } = req.body;
  if (!content || !chatId) return res.status(400).send("Missing fields");

  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
    viewOnce,
  });

  message = await message.populate("sender", "name email");
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

  res.json(message);
});

router.get("/:chatId", protect, async (req, res) => {
  let messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  messages = await Promise.all(messages.map(async (msg) => {
    if (msg.viewOnce && !msg.viewed) {
      msg.viewed = true;
      await msg.save();
      return msg;
    }
    if (msg.viewOnce && msg.viewed) {
      msg.content = "***";
    }
    return msg;
  }));

  res.json(messages);
});

module.exports = router;