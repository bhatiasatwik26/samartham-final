import express from "express";
import { sendMailController } from "../controllers/email.controller.js";

const router = express.Router();

// Email sending route
router.post("/send", sendMailController);

export default router;
