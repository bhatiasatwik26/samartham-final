import { sendEmail } from "../utils/email.utils.js";

export const sendMailController = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging log

        const { email, emailType, params } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        console.log("Sending email to:", email); // Debugging log

        await sendEmail(email, emailType, params);

        res.status(200).json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ error: "Failed to send email" });
    }
};
