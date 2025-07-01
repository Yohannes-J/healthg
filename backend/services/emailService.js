

import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Send email function
export const sendAppointmentNotification = async (doctorEmail, patientName, appointmentDate) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: doctorEmail, // Recipient address (doctor's email)
        subject: 'New Appointment Booked', // Subject line
        text: `Dear Doctor,\n\nYou have a new appointment booked with patient ${patientName} on ${appointmentDate}.\n\nBest Regards,\nYour Health Guidance Team`,
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.log('Error sending email:', error);
        return { success: false, message: 'Error sending email' };
    }
};
