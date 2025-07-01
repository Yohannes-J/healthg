import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API to create user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !password || !email) {
            return res.status(400).json({ success: false, message: "Incomplete Information" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid Email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = { name, email, password: hashedPassword };

        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// API to update profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file; // Get uploaded image

        if (!name || !phone || !address || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Missing Information" });
        }

        let parsedAddress;
        try {
            parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let updatedData = { name, phone, address: parsedAddress, dob, gender };

        if (imageFile) {
            const imagePath = `/uploads/${imageFile.filename}`;
            
            // Remove old profile image if exists
            if (user.profileImage && fs.existsSync(path.join(__dirname, "..", user.profileImage))) {
                fs.unlinkSync(path.join(__dirname, "..", user.profileImage));
            }
            
            updatedData.profileImage = imagePath;
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
        res.json({ success: true, message: "Profile updated successfully", profileImage: updatedUser.profileImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


//Api to bok appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData.available) return res.json({ success: false, message: "Doctor not available" });

        let slots_booked = docData.slots_booked;

        // Checking slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');
 delete docData.slots_booked
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save new slot data in the doctor's profile
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Booked' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user appointment for frontend my-appointment page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment

const cancelAppointment = async(req, res)=>{
    try {
       const {userId, appointmentId} =req.body 
       const appointmentData = await appointmentModel.findById(appointmentId)
       // verify appointment user
       if (appointmentData.userId !== userId) {
        return res.json({success:false, message:"unauthorized action"})
        
       }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})


    //releasing doctor slot

    const {docId, slotDate,slotTime} = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success:true, message:"appointment cancelled"})

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };
