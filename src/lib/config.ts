// Competition Configuration
export const COMPETITION_CONFIG = {
  // Main competition start date
  startDate: new Date('2025-09-29T00:00:00'),
  
  // Competition dates
  dates: {
    vlogStart: new Date('2025-09-29T00:00:00'),
    vlogEnd: new Date('2025-10-20T23:59:59'),
    filmStart: new Date('2025-10-20T00:00:00'),
    filmEnd: new Date('2025-10-25T23:59:59'),
    offlineDay1: new Date('2025-10-29T08:00:00'),
    offlineDay2: new Date('2025-10-30T08:00:00'),
    winnersAnnouncement: new Date('2025-11-01T14:00:00')
  },
  
  // Contact information
  contact: {
    phone: '+62 812-3456-7890',
    whatsapp: '+62 812-3456-7890',
    email: 'info@competition2025.ac.id',
    registrationEmail: 'registration@competition2025.ac.id',
    address: 'Campus 1 - Administration Office, Jl. Contoh No. 123, Pangandaran'
  },
  
  // Social media links
  socialMedia: {
    instagram: 'https://instagram.com/competition2025',
    youtube: 'https://youtube.com/@competition2025',
    facebook: 'https://facebook.com/competition2025',
    twitter: 'https://twitter.com/competition2025'
  },
  
  // File upload limits
  uploadLimits: {
    maxFileSize: 500 * 1024 * 1024, // 500MB in bytes
    allowedVideoFormats: ['mp4', 'mov', 'avi'],
    allowedImageFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxTeamMembers: 5
  }
};

// Helper function to check if competition is active
export const isCompetitionActive = () => {
  const now = new Date();
  return now >= COMPETITION_CONFIG.startDate;
};

// Helper function to get current competition phase
export const getCurrentPhase = () => {
  const now = new Date();
  const { dates } = COMPETITION_CONFIG;
  
  if (now < dates.vlogStart) return 'upcoming';
  if (now >= dates.vlogStart && now <= dates.vlogEnd) return 'vlog-submission';
  if (now >= dates.filmStart && now <= dates.filmEnd) return 'film-submission';
  if (now >= dates.offlineDay1 && now <= dates.offlineDay2) return 'offline-events';
  if (now > dates.offlineDay2 && now < dates.winnersAnnouncement) return 'judging';
  if (now >= dates.winnersAnnouncement) return 'completed';
  
  return 'upcoming';
};