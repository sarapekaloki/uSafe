

export const formatDate =  (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (date.toDateString() === today.toDateString()) {
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "YESTERDAY " + date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()) && date < today) {
        const dayOfWeek = daysOfWeek[date.getDay()];
        return dayOfWeek + " " + date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
        return date.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    }
}
