// backend/routes/appointmentRoute.js

import express from 'express';
import { sendAppointmentNotification } from '../services/emailService.js';
import Appointment from '../models/appointmentModel.js'; // Assuming you have an Appointment model
import Doctor from '../models/doctorModel.js'; // Assuming you have a Doctor model

const router = express.Router();

// Booking an appointment route
router.post('/book', async (req, res) => {
    const { userId, docId, appointmentDate } = req.body;

    try {
        // Find the doctor
        const doctor = await Doctor.findById(docId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Create an appointment
        const appointment = new Appointment({
            userId,
            docId,
            appointmentDate,
        });

        await appointment.save();

        // Send email to the doctor
        sendAppointmentNotification(
            doctor.email, // Assuming doctor has an 'email' field
            req.body.name, // Replace with the actual patient name from request
            appointmentDate
        );

        return res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;
