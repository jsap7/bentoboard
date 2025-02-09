export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 100);

  if (hours > 0) {
    return `${hours}:${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
  }

  if (minutes > 0) {
    return `${minutes}:${padNumber(remainingSeconds)}`;
  }

  return `${remainingSeconds}.${padNumber(milliseconds)}`;
};

const padNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
}; 