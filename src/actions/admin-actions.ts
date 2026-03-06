"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Paths
const configPath = path.join(process.cwd(), 'src/lib/site-config.json');
const settingsPath = path.join(process.cwd(), 'src/lib/siteSettings.json');
const projectsPath = path.join(process.cwd(), 'src/lib/projects.json');
const messagesPath = path.join(process.cwd(), 'src/lib/messages.json');
const uploadDir = path.join(process.cwd(), 'public/uploads');

/**
 * HELPER: Safe JSON Reader
 */
async function readJsonSafe(filePath: string, fallback: any) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return fallback;
  }
}

/**
 * HELPER: Save binary file to public/uploads
 */
async function saveLocalFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
    await fs.writeFile(path.join(uploadDir, safeName), buffer);
    return `/uploads/${safeName}`;
  } catch (error) {
    console.error("File Save Error:", error);
    return null;
  }
}

/**
 * AUTH LOGIC
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

/**
 * BRAND IDENTITY LOGIC (Updated for File Uploads)
 */
export async function updateBrandData(formData: FormData) {
  try {
    // 1. Read existing config
    const data = await readJsonSafe(configPath, { brand: {} });

    const name = formData.get('studioName') as string;
    const logoFile = formData.get('logoFile') as File;
    
    // 2. Process File Upload if a new file exists
    let logoPath = data.brand.logoImage || ""; // Keep existing if no new upload
    
    if (logoFile && logoFile.size > 0) {
      const savedPath = await saveLocalFile(logoFile);
      if (savedPath) {
        logoPath = savedPath;
      }
    }

    // 3. Update the Brand Object
    // We remove logoInitial since we are prioritizing the image logo
    data.brand = {
      ...data.brand,
      name: name || data.brand.name || "Studio",
      logoImage: logoPath,
    };

    // 4. Persist to JSON
    await fs.writeFile(configPath, JSON.stringify(data, null, 2));

    // 5. Revalidate to show changes instantly
    revalidatePath('/', 'layout'); 
    revalidatePath('/admin', 'layout'); 
    
    return { success: true };
  } catch (error) {
    console.error("Brand Identity Update Error:", error);
    return { success: false };
  }
}

/**
 * CONTACT PAGE CONFIGURATION LOGIC
 */
export async function updateContactSettings(formData: FormData) {
  try {
    const data = await readJsonSafe(settingsPath, { contact: {}, footer: {}, socials: [] });

    data.contact = {
      email: formData.get('email'),
      heroTitleLine1: formData.get('line1'),
      heroTitleLine2: formData.get('line2'),
      location: formData.get('location'),
      directPhone: formData.get('phone'),
    };

    await fs.writeFile(settingsPath, JSON.stringify(data, null, 2));
    
    revalidatePath('/inquiry');
    revalidatePath('/admin/contact');
    
    return { success: true };
  } catch (error) {
    console.error("Contact Settings Update Error:", error);
    return { success: false };
  }
}

/**
 * MESSAGES LOGIC (Inquiries from users)
 */
export async function saveInquiry(data: any) {
  try {
    const messages = await readJsonSafe(messagesPath, []);

    const isSpam = data instanceof FormData ? data.get('_honeypot') : data._honeypot;
    if (isSpam) return { success: true }; 

    const name = data instanceof FormData ? data.get('name') : data.name;
    const email = data instanceof FormData ? data.get('email') : data.email;
    const vision = data instanceof FormData ? data.get('vision') : data.vision;

    if (!name || !email || !vision) {
      return { success: false, error: "Missing required fields" };
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name: name.toString(),
      email: email.toString(),
      vision: vision.toString(),
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }),
      read: false
    };

    messages.unshift(newMessage);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
    
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error("Inquiry Save Error:", error);
    return { success: false };
  }
}

export async function toggleMessageRead(id: string) {
  try {
    const messages = await readJsonSafe(messagesPath, []);
    const index = messages.findIndex((m: any) => m.id === id);
    
    if (index !== -1) {
      messages[index].read = !messages[index].read;
      await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
      revalidatePath('/admin/messages');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteMessage(id: string) {
  try {
    let messages = await readJsonSafe(messagesPath, []);
    messages = messages.filter((m: any) => m.id !== id);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * FOOTER SETTINGS LOGIC
 */
export async function updateFooterSettings(formData: FormData) {
  try {
    const data = await readJsonSafe(settingsPath, { footer: {}, socials: [] });

    data.footer = {
      ...data.footer,
      copyright: formData.get('copyright'),
      narrative: formData.get('narrative'),
      email: formData.get('email'),
      availability: formData.get('availability'),
    };

    data.socials = [
      { label: "GH", url: formData.get('github') },
      { label: "LI", url: formData.get('linkedin') },
      { label: "IG", url: formData.get('instagram') },
      { label: "TW", url: formData.get('twitter') }
    ].filter(item => item.url);

    await fs.writeFile(settingsPath, JSON.stringify(data, null, 2));
    
    revalidatePath('/');
    revalidatePath('/inquiry'); 
    
    return { success: true };
  } catch (error) {
    console.error("Settings Update Error:", error);
    return { success: false };
  }
}

/**
 * HERO & ABOUT LOGIC
 */
export async function updateHeroData(prevState: any, formData: FormData) {
  try {
    const data = await readJsonSafe(configPath, { hero: {}, about: {} });

    data.hero = {
      upperLabel: formData.get('upperLabel'),
      mainTitleLine1: formData.get('line1'),
      mainTitleLine2: formData.get('line2'),
      subtext: formData.get('subtext'),
      location: formData.get('location'),
      availability: formData.get('availability'),
    };

    await fs.writeFile(configPath, JSON.stringify(data, null, 2));
    revalidatePath('/');
    return { success: true, message: "Hero configuration updated." };
  } catch (error) {
    return { success: false, message: "Failed to update Hero." };
  }
}

export async function updateAboutData(prevState: any, formData: FormData) {
  try {
    const data = await readJsonSafe(configPath, { hero: {}, about: {} });

    const aboutFile = formData.get('aboutImageFile') as File;
    let aboutImagePath = formData.get('existingAboutImage') as string;
    
    if (aboutFile && aboutFile.size > 0) {
      const savedPath = await saveLocalFile(aboutFile);
      if (savedPath) aboutImagePath = savedPath;
    }

    data.about = {
      headlineLine1: formData.get('h1'),
      headlineLine2: formData.get('h2'),
      subheading: formData.get('subheading'),
      p1: formData.get('p1'),
      philosophy: formData.get('philosophy'),
      aboutImage: aboutImagePath,
      capabilities: (formData.get('skills') as string || "").split(',').map(s => s.trim()).filter(Boolean)
    };

    await fs.writeFile(configPath, JSON.stringify(data, null, 2));
    revalidatePath('/');
    return { success: true, message: "Narrative synchronized successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update narrative." };
  }
}

/**
 * TECH STACK LOGIC
 */
export async function updateStack(formData: FormData) {
  try {
    const data = await readJsonSafe(configPath, { hero: {}, about: { capabilities: [] } });
    const rawStack = formData.get('capabilities') as string;
    
    data.about.capabilities = rawStack
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    await fs.writeFile(configPath, JSON.stringify(data, null, 2));
    revalidatePath('/admin/stack');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * PROJECTS LOGIC
 */
export async function saveProject(formData: FormData) {
  try {
    const data = await readJsonSafe(projectsPath, { projects: [] });
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;

    const coverFile = formData.get('coverFile') as File;
    let coverPath = formData.get('existingCover') as string || "";
    if (coverFile && coverFile.size > 0) {
      const savedPath = await saveLocalFile(coverFile);
      if (savedPath) coverPath = savedPath;
    }

    const existingGalleryStr = formData.get('existingGallery') as string;
    const keptImages: string[] = existingGalleryStr ? JSON.parse(existingGalleryStr) : [];
    
    const galleryFiles = formData.getAll('galleryFiles') as File[];
    const newUploads = await Promise.all(
      galleryFiles
        .filter(f => f.size > 0)
        .map(file => saveLocalFile(file))
    );

    const finalGallery = [
      ...keptImages, 
      ...newUploads.filter((p): p is string => p !== null)
    ];

    const projectObject = {
      id: id || `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title,
      category: formData.get('category'),
      description: formData.get('description'),
      coverImage: coverPath,
      gallery: finalGallery,
      liveLink: formData.get('liveLink'),
      featured: formData.get('featured') === 'on',
      stack: (formData.get('stack') as string || "").split(',').map(s => s.trim()).filter(Boolean),
      year: formData.get('year') || "2026"
    };

    if (id) {
      const idx = data.projects.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        data.projects[idx] = projectObject;
      } else {
        data.projects.unshift(projectObject);
      }
    } else {
      data.projects.unshift(projectObject);
    }

    await fs.writeFile(projectsPath, JSON.stringify(data, null, 2));
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Project Save Error:", error);
    return { success: false };
  }
}

export async function deleteProject(id: string) {
  try {
    const data = await readJsonSafe(projectsPath, { projects: [] });
    data.projects = data.projects.filter((p: any) => p.id !== id);
    await fs.writeFile(projectsPath, JSON.stringify(data, null, 2));
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}