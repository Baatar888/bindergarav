"use client";
import { SiteData, defaultData } from "./data";

// Admin нууц үг - зөвхөн client-side session-д хадгалах
let sessionPassword = "";
export function setAdminPassword(pass: string) { sessionPassword = pass; }
export function getAdminPassword() { return sessionPassword; }

// MongoDB API-аас мэдээлэл татах
export async function getSiteData(): Promise<SiteData> {
  try {
    const res = await fetch("/api/site-data", { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    if (json.success && json.data) return { ...defaultData, ...json.data };
  } catch (e) {
    console.error("getSiteData error:", e);
  }
  return defaultData;
}

// MongoDB-д хадгалах
export async function saveSiteData(data: SiteData): Promise<boolean> {
  try {
    const res = await fetch("/api/site-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": sessionPassword,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.success === true;
  } catch (e) {
    console.error("saveSiteData error:", e);
    return false;
  }
}

// Файл upload хийх (зураг/бичлэг)
export async function uploadFile(
  file: File,
  folder = "medclinic"
): Promise<{ url: string; type: "image" | "video" } | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-admin-password": sessionPassword },
      body: formData,
    });
    const json = await res.json();
    if (json.success) return { url: json.url, type: json.type };
  } catch (e) {
    console.error("uploadFile error:", e);
  }
  return null;
}

// Reset хийх (default өгөгдөл оруулах)
export async function resetSiteData(): Promise<boolean> {
  return saveSiteData(defaultData);
}
