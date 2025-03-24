import cron from "node-cron";
import User from "../model/User.model.js";
import { sendEmail } from "../utils/email.utils.js";

// Function to check and notify users about overdue tasks
const checkOverdueTasks = async () => {
    try {
        const currentDate = new Date();
        // Find users with overdue tasks
        const users = await User.find({
            "eventsSubscribed.assignedTasks": {
                $elemMatch: {
                    status: "pending",
                    deadline: { $lt: currentDate }, // Find tasks past deadline
                },
            },
        });

        if (users.length === 0) {
            console.log("No overdue tasks found.", currentDate);
            return;
        }

        // Loop through users with overdue tasks
        for (const user of users) {
            let overdueTasks = [];

            user.eventsSubscribed.forEach((event) => {
                event.assignedTasks.forEach((task) => {
                    if (task.status === "pending" && new Date(task.deadline) < currentDate) {
                        overdueTasks.push({ name: task.name, deadline: task.deadline });
                    }
                });
            });

            if (overdueTasks.length > 0) {
                for (const task of overdueTasks) {
                    await sendEmail(user.email, "taskDeadlineReminder", {
                        name: user.name,
                        task: task.name,
                        deadline: new Date(task.deadline).toDateString(),
                    });

                    console.log(`Reminder email sent to ${user.email} for task: ${task.name}`);
                }
            }
        }
    } catch (error) {
        console.error("Error checking overdue tasks:", error);
    }
};

// Schedule cron job to run every day at 8 AM
cron.schedule("57 22 * * *", () => {
    console.log("Running overdue task check...");
    checkOverdueTasks();
});

export default checkOverdueTasks;
