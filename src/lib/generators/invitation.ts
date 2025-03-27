
export function generateInvitationText(eventName: string, hostName: string, eventType: string, theme: string, date: Date): string {
  const dateString = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
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
  
  return invitations[theme] || `
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
