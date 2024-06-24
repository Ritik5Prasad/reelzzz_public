export const getRelativeTime = (timestamp: string | number | Date): string => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(timestamp).getTime();
  
    const seconds = Math.floor(timeDiff / 1000);
    if (seconds < 60) return `${seconds}s`;
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
  
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
  
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
  
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}m`;
  
    const years = Math.floor(months / 12);
    return `${years}y`;
  };
  
  export const convertDurationToMMSS = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  export default {getRelativeTime, convertDurationToMMSS};
  