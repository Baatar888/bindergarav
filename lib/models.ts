import mongoose, { Schema, Document } from "mongoose";

export interface ISiteData extends Document {
  site: {
    name: string;
    logo: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    emergencyText: string;
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    imageUrl?: string;   // Cloudinary зургийн URL
    videoUrl?: string;   // Cloudinary бичлэгийн URL
  };
  stats: Array<{ value: string; label: string }>;
  about: {
    title: string;
    description: string;
    imageUrl?: string;
    feature1Title: string;
    feature1Text: string;
    feature2Title: string;
    feature2Text: string;
  };
  services: Array<{ id: number; title: string; description: string; icon: string; imageUrl?: string }>;
  doctors: Array<{ id: number; name: string; specialty: string; experience: string; imageUrl?: string }>;
  schedule: Array<{ day: string; hours: string }>;
  testimonials: Array<{ id: number; name: string; text: string; rating: number }>;
  nav: Array<{ label: string; href: string }>;
}

const SiteDataSchema = new Schema<ISiteData>(
  {
    site: {
      name: String,
      logo: String,
      tagline: String,
      phone: String,
      email: String,
      address: String,
      workingHours: String,
      emergencyText: String,
    },
    hero: {
      badge: String,
      title: String,
      description: String,
      imageUrl: String,
      videoUrl: String,
    },
    stats: [{ value: String, label: String }],
    about: {
      title: String,
      description: String,
      imageUrl: String,
      feature1Title: String,
      feature1Text: String,
      feature2Title: String,
      feature2Text: String,
    },
    services: [{ id: Number, title: String, description: String, icon: String, imageUrl: String }],
    doctors: [{ id: Number, name: String, specialty: String, experience: String, imageUrl: String }],
    schedule: [{ day: String, hours: String }],
    testimonials: [{ id: Number, name: String, text: String, rating: Number }],
    nav: [{ label: String, href: String }],
  },
  { timestamps: true }
);

// Singleton pattern - Hot reload-д давхардахгүй
export const SiteDataModel =
  mongoose.models.SiteData || mongoose.model<ISiteData>("SiteData", SiteDataSchema);
