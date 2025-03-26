import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

// Email Templates
const emailTemplates = {
    registrationSuccess: ({ name }) => ({
        subject: "Registration Successful!",
        text: `Hello ${name},\n\nWe're excited to have you at our event. See you soon!\n\nBest,\nEvent Team`,
        html: `<h3>Hello ${name},</h3><p>We're excited to have you at our event. See you soon!</p><p>Best,<br>Event Team</p>`,
    }),
    taskDeadlineReminder: ({ name, task, deadline }) => ({
        subject: "Task Deadline Reminder",
        text: `Hello ${name},\n\nYour task "${task}" is due by ${deadline}. Please complete it on time.\n\nBest,\nEvent Team`,
        html: `<h3>Hello ${name},</h3><p>Your task <b>"${task}"</b> is due by <b>${deadline}</b>. Please complete it on time.</p><p>Best,<br>Event Team</p>`,
    }),
    taskAssigned: ({ name, task, eventName, deadline }) => ({
        subject: "New Task Assigned!",
        text: `Hello ${name},\n\nYou have been assigned a new task: "${task}" for the event "${eventName}".\n\nDeadline: ${deadline}\n\nPlease make sure to complete it on time.\n\nBest,\nEvent Team`,
        html: `<h3>Hello ${name},</h3><p>You have been assigned a new task: <b>"${task}"</b> for the event <b>"${eventName}"</b>.</p><p>Deadline: <b>${deadline}</b></p><p>Please make sure to complete it on time.</p><p>Best,<br>Event Team</p>`,
    }),
    newEventNotification: ({ name, eventName, eventCategory, eventDate, eventLocation, registrationDeadline }) => ({
        subject: `New ${eventCategory} Event: ${eventName}`,
        text: `Hello ${name},\n\nWe are excited to announce a new event in the ${eventCategory} category that matches your interests!\n\nEvent: ${eventName}\nDate: ${eventDate}\nLocation: ${eventLocation}\nRegistration Deadline: ${registrationDeadline}\n\nLogin to your account to register for this event.\n\nBest,\nEvent Team`,
        html: `<h3>Hello ${name},</h3>
              <p>We are excited to announce a new event in the <b>${eventCategory}</b> category that matches your interests!</p>
              <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #4CAF50; background-color: #f9f9f9;">
                <p><b>Event:</b> ${eventName}</p>
                <p><b>Date:</b> ${eventDate}</p>
                <p><b>Location:</b> ${eventLocation}</p>
                <p><b>Registration Deadline:</b> ${registrationDeadline}</p>
              </div>
              <p>Login to your account to register for this event.</p>
              <p>Best,<br>Event Team</p>`,
    }),
    requestforEventRegistration: ({ name, eventName, eventCategory, eventDate, eventLocation, registrationDeadline }) => ({
        subject: `New ${eventCategory} Event: ${eventName}`,
        text: `Hello ${name},\n\nWe are excited to announce a new event in the ${eventCategory} category that matches your interests!\n\nEvent: ${eventName}\nDate: ${eventDate}\nLocation: ${eventLocation}\nRegistration Deadline: ${registrationDeadline}\n\nLogin to your account to register for this event.\n\nBest,\nEvent Team`,
        html: `<h3>Hello ${name},</h3>
              <p>We are excited to announce a new event in the <b>${eventCategory}</b> category that matches your interests!</p>`
    }),
    
};


// Send Email Function
export const sendEmail = async (email, emailType, params) => {
    try {
        console.log(`Sending email to: ${email}`);
        console.log(`Using email type: ${emailType}`);

        if (!email || !emailType || !emailTemplates[emailType]) {
            throw new Error("Invalid email data provided.");
        }

        // Get email content based on type
        const { subject, text, html } = emailTemplates[emailType](params);

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject,
            text,
            html,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);

        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        console.error("Error sending email:", error.message);
        return { success: false, message: "Failed to send email", error: error.message };
    }
};
