export const REGISTRATION_CONFIG = {
  // Google Apps Script Web App URL for Sheets forwarding
  endpointUrl: import.meta.env.VITE_REGISTRATION_ENDPOINT_URL || '',
  
  // Official WhatsApp group join link
  whatsappGroupUrl: 'https://chat.whatsapp.com/FTjEEA2qpAo0UVLrG70ly9?s=sh&p=i&mlu=4',
  
  // Field keys mapped to match Google Sheet header columns exactly
  sheetFields: {
    timestamp: 'Timestamp',
    emailAddress: 'Email Address',
    teamName: 'Team Name',
    leaderName: 'Team Leader Name',
    leaderEmail: 'Team Leader Email ID',
    leaderPhone: 'Team Leader Contact',
    memberName: 'Team Member (Name)',
    memberEmail: 'Team Member (Email ID)',
    memberPhone: 'Team Member (Contact)',
  }
};
