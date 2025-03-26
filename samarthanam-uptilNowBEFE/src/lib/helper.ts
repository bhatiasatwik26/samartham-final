export const getEventDate = (dateTimeStr: Date) => {
  try {
    const dateObj = new Date(dateTimeStr);

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Unknown date";
  }
};

export const getEventTime = (dateTimeStr) => {
  try {
    const dateObj = new Date(dateTimeStr);

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error parsing time:", error);
    return "Unknown time";
  }
};
