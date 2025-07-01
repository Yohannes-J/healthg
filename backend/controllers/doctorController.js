import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// Toggle doctor's availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success: true,
      message: "Availability changed",
      available: doctor.available,
    });
  } catch (error) {
    console.error("changeAvailability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of doctors without sensitive info like password and email
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");

    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

    const doctorsWithFullImagePath = doctors.map((doctor) => {
      const imageUrl = doctor.image ? `${backendUrl}${doctor.image}` : null;

      return {
        ...doctor._doc,
        image: imageUrl,
      };
    });

    res.json({ success: true, doctors: doctorsWithFullImagePath });
  } catch (error) {
    console.error("doctorList error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error("loginDoctor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointments for a doctor
const appointmentDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("appointmentDoctor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark appointment as completed
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== docId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Mark failed: Unauthorized or appointment not found",
        });
    }

    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment completed" });
  } catch (error) {
    console.error("appointmentComplete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== docId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Cancellation failed: Unauthorized or appointment not found",
        });
    }

    appointment.cancelled = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error("appointmentCancel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach((appointment) => {
      if (appointment.isCompleted || appointment.payment) {
        earnings += appointment.amount || 0;
      }
      if (appointment.userId) {
        patientSet.add(appointment.userId.toString());
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: appointments
        .slice()
        .sort((a, b) => b.date - a.date)
        .slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("doctorDashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor profile data
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    if (!profileData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, profileData });
  } catch (error) {
    console.error("doctorProfile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor profile data
const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.body.docId;

    if (!doctorId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: No doctor ID provided",
        });
    }

    const { address, fees, available, availableTime } = req.body;

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (address !== undefined) doctor.address = address;
    if (fees !== undefined) doctor.fees = fees;
    if (available !== undefined) doctor.available = available;
    if (availableTime !== undefined) doctor.availableTime = availableTime;

    await doctor.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("updateDoctorProfile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
