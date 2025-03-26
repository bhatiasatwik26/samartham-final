import express from "express";
import { 
  getEventStats, 
  getCategoryStats, 
  getDashboardStats, 
  getRecentActivities,
  getVolunteerOverview,
  getEventDetailReport
} from "../controllers/report.controller.js";

const router = express.Router();

// Get event statistics for reports
router.get('/events', getEventStats);

// Get category statistics
router.get('/categories', getCategoryStats);

// Get dashboard stats
router.get('/dashboard', getDashboardStats);

// Get recent activities
router.get('/activities', getRecentActivities);

// Get volunteer overview
router.get('/volunteer-overview', getVolunteerOverview);

// Get detailed report for a specific event by name
router.get('/event/:eventName/detail', getEventDetailReport);

export default router; 