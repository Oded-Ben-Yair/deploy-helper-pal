
/**
 * Invitation text generator
 * Creates themed invitation text based on event parameters
 */

/**
 * Generate themed invitation text for an event
 * @param eventName Name of the person or event
 * @param hostName Name of the host
 * @param eventType Type of event (birthday, wedding, etc.)
 * @param theme Selected theme
 * @param date Event date
 * @returns Formatted invitation text
 */
export function generateInvitationText(eventName: string, hostName: string, eventType: string, theme: string, date: Date): string {
  const dateString = formatEventDate(date);
  const timeString = formatEventTime(date);
  
  // Theme-specific invitation templates
  const invitations: Record<string, string> = {
    "Superhero": `CALLING ALL SUPERHEROES!

Your presence is requested for a SUPER ${eventType}!
${eventName}

Join us for epic adventures, heroic games, and super treats.
Don't forget your superhero costume!

DATE: ${dateString}
TIME: ${timeString}
LOCATION: [Insert Location]

RSVP to ${hostName} by [Insert RSVP Date]

With great power comes great ${eventType.toLowerCase()} parties!`,

    "Princess": `🌟 ROYAL INVITATION 🌟

By royal decree, you are cordially invited to
${eventName}
A Royal ${eventType} Celebration!

There will be royal activities, magical moments, and delicious treats
fit for royalty!

DATE: ${dateString}
TIME: ${timeString}
CASTLE LOCATION: [Insert Location]

Please RSVP to the Royal Messenger (${hostName}) by [Insert RSVP Date]

Attire: Your most royal outfits are encouraged!`,

    "Sports": `GAME ON! 🏆

${eventName}
A CHAMPIONSHIP ${eventType.toUpperCase()}!

Join our all-star lineup for games, competitions, and sports-themed fun!
Come dressed in your favorite sports gear and ready to play!

WHEN: ${dateString} at ${timeString}
WHERE: [Insert Location]
  
RSVP to Coach ${hostName} by [Insert RSVP Date]

Don't miss this winning celebration!`,

    "Space": `🚀 MISSION TO CELEBRATE 🚀

ATTENTION ALL ASTRONAUTS!
${eventName}
A Cosmic ${eventType}!

Join us for an interstellar celebration with cosmic games,
space-themed treats, and out-of-this-world fun!

LAUNCH DATE: ${dateString}
COUNTDOWN BEGINS: ${timeString}
MISSION CONTROL: [Insert Location]

RSVP to Ground Control (${hostName}) at [Contact] by [Insert RSVP Date]

Space attire encouraged but not required!`,
    
    "Dinosaur": `ROAR! You're invited to a DINO-MITE celebration!

${eventName}
A Prehistoric ${eventType}!

Stomp on over for prehistoric fun, fossil hunting, and jurassic treats!

DATE: ${dateString}
TIME: ${timeString}
EXCAVATION SITE: [Insert Location]

RSVP to ${hostName} by [Insert RSVP Date]

Dinosaur costumes and explorer gear welcome!`,
  };
  
  // Return themed invitation or default if theme not found
  return invitations[theme] || getDefaultInvitation(eventName, eventType, hostName, dateString, timeString);
}

/**
 * Format the event date in a readable format
 * @param date Date object
 * @returns Formatted date string
 */
function formatEventDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Format the event time in a readable format
 * @param date Date object
 * @returns Formatted time string
 */
function formatEventTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Get default invitation text
 * @param eventName Name of the person or event
 * @param eventType Type of event
 * @param hostName Name of the host
 * @param dateString Formatted date string
 * @param timeString Formatted time string
 * @returns Default invitation text
 */
function getDefaultInvitation(
  eventName: string, 
  eventType: string, 
  hostName: string,
  dateString: string,
  timeString: string
): string {
  return `
You're Invited!

Please join us to celebrate
${eventName}
A special ${eventType}!

Hosted by: ${hostName}

DATE: ${dateString}
TIME: ${timeString}
LOCATION: [Insert Location]

RSVP to ${hostName} by [Insert RSVP Date]

We can't wait to celebrate with you!
  `;
}
