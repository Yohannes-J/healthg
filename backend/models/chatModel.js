import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
  message: { type: String, required: true },
 
 
  
  timestamp: { type: Date, default: Date.now }
});


const ChatModel = mongoose.model('Chat', messageSchema);
export default ChatModel;
