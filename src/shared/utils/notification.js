export const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillator for the notification sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configure sound
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
  
  // Configure volume envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
  
  // Play sound
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}; 