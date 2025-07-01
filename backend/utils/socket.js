export const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("send_message", (msg) => {
      socket.broadcast.emit("receive_message", msg);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};
