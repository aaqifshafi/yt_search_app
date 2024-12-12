export const timeAgo = (dateString: string) => {
  const now = new Date();
  const videoDate = new Date(dateString);
  const diffInSeconds = Math.floor(
    (now.getTime() - videoDate.getTime()) / 1000
  );
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30.436875); // Average days in a month
  const diffInYears = Math.floor(diffInDays / 365.25); // Average days in a year

  // More YouTube-like time ago representations
  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return diffInSeconds < 5
      ? "just now"
      : `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
  }
};

export const formatViewCount = (viewCount: number) => {
  if (viewCount >= 1_000_000_000) {
    // Support billions with one decimal place
    return (viewCount / 1_000_000_000).toFixed(1) + "B";
  } else if (viewCount >= 1_000_000) {
    // Millions with one decimal place
    return (viewCount / 1_000_000).toFixed(1) + "M";
  } else if (viewCount >= 10_000) {
    // Thousands with one decimal place for values over 10K
    return (viewCount / 1_000).toFixed(1) + "K";
  } else if (viewCount >= 1_000) {
    // Whole number thousands
    return Math.floor(viewCount / 1_000) + "K";
  }
  return viewCount.toString();
};

export const parseISO8601Duration = (duration: string) => {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const match = duration.match(regex);

  if (!match) {
    throw new Error("Invalid duration format");
  }

  // Extract hours, minutes, and seconds, defaulting to 0 if not provided
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  // Improved formatting to match YouTube's style
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  } else {
    return `0:${String(seconds).padStart(2, "0")}`;
  }
};
