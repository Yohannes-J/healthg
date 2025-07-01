
import Chat from "../models/chatModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }
    const user = await userModel.findOne();
    if (!user) {
      return res.status(404).json({ error: "No user found in the database" });
    }
    const doctor = await doctorModel.findOne();
    if (!doctor) {
      return res.status(404).json({ error: "No doctor found in the database" });
    }

    const chat = new Chat({ message, userId: user._id , docId: doctor._id });
    await chat.save();

    res.status(201).json({ message: "message send successfully", data: user ,doctor});
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to send message", details: err.message });
  }
};

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.find()
      .populate("userId", "_id")
      .populate("docId", "_id");

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages", details: err.message });
  }
};
  

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const chat = await Chat.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Message updated successfully", data: chat });
  } catch (err) {
    res.status(500).json({ error: "Failed to update message", details: err.message });
  }
};
