const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send-message", (messageData) => {
      io.to(messageData.chatId).emit("receive-message", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
