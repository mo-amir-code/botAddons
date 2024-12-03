import type { FormatTimestampType } from "../types/services";

const formatTimestamp = ({ timestamp, type }: FormatTimestampType) => {
    const date = new Date(timestamp);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const isAM = hours < 12;
    const period = isAM ? "AM" : "PM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // If 0, set to 12

    // Construct date and time strings
    const dateStr = `${day}/${month}/${year}`;
    const timeStr = `${hours}:${minutes} ${period}`;

    // Return based on type
    if (type === "date") return dateStr;
    if (type === "time") return timeStr;
    if (type === "both") return `${dateStr} ${timeStr}`;

    return null
}

export {
    formatTimestamp
}