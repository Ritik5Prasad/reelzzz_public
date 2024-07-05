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

export const extractTypeAndId = (url: string): {type: string; id: string} => {
  let type: string = '';
  let id: string = '';

  // Regex patterns to match each type of URL
  const reelPattern1 = /^http:\/\/localhost:3000\/share\/reel\/([a-f\d]{24})$/;
  const reelPattern2 = /^reelzzz:\/\/share\/reel\/([a-f\d]{24})$/;
  const userPattern1 =
    /^http:\/\/localhost:3000\/share\/user\/([a-zA-Z0-9_]+)$/;
  const userPattern2 = /^reelzzz:\/\/share\/user\/([a-zA-Z0-9_]+)$/;

  if (reelPattern1.test(url)) {
    type = 'reel';
    id = url.match(reelPattern1)![1];
  } else if (reelPattern2.test(url)) {
    type = 'reel';
    id = url.match(reelPattern2)![1];
  } else if (userPattern1.test(url)) {
    type = 'user';
    id = url.match(userPattern1)![1];
  } else if (userPattern2.test(url)) {
    type = 'user';
    id = url.match(userPattern2)![1];
  } else {
    console.log('URL format not recognized');
  }

  return {type, id};
};

export default {getRelativeTime, convertDurationToMMSS,extractTypeAndId};
