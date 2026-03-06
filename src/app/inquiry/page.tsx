import fs from 'fs/promises';
import path from 'path';
import ContactForm from './ContactForm';

async function getSettings() {
  // Path to your JSON file based on your structure
  const settingsPath = path.join(process.cwd(), 'src/lib/siteSettings.json');
  
  try {
    const file = await fs.readFile(settingsPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    // Fallback if the file doesn't exist yet
    return {
      contact: { email: "hello@liza.studio", location: "London, UK", directPhone: "+44 (0) 000" },
      socials: [
        { label: "LI", url: "#" },
        { label: "IG", url: "#" },
        { label: "TW", url: "#" },
        { label: "GH", url: "#" }
      ]
    };
  }
}

export default async function Page() {
  const settings = await getSettings();

  return <ContactForm settings={settings} />;
}