"use client";
import { useState, useEffect, useRef } from "react";
import { getSiteData, saveSiteData, resetSiteData, uploadFile, setAdminPassword } from "@/lib/store";
import { SiteData, defaultData } from "@/lib/data";
import { Save, RefreshCw, Eye, Plus, Trash2, Settings, Layout, Users, Briefcase, MessageSquare, Clock, Globe, Upload, X, Image, Video } from "lucide-react";

type Tab = "site" | "hero" | "stats" | "about" | "services" | "doctors" | "schedule" | "testimonials" | "nav";

// Текст оруулах талбар
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 resize-none h-24" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
      )}
    </div>
  );
}

// Зураг/бичлэг upload компонент
function MediaUpload({
  label,
  currentUrl,
  onUpload,
  accept = "image/*",
  type = "image",
  folder = "medclinic",
  adminPass,
}: {
  label: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
  type?: "image" | "video" | "both";
  folder?: string;
  adminPass: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptAttr = type === "both" ? "image/*,video/*" : type === "video" ? "video/*" : "image/*";

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    // Түр sessionPassword тохируулах
    setAdminPassword(adminPass);
    const result = await uploadFile(file, folder);
    setUploading(false);
    if (result) {
      onUpload(result.url);
    } else {
      setError("Upload амжилтгүй. Файлын хэмжээ шалгана уу.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>

      {/* Одоогийн зураг/бичлэг харуулах */}
      {currentUrl && (
        <div className="mb-2 relative inline-block">
          {currentUrl.match(/\.(mp4|mov|webm|avi)$/i) ? (
            <video src={currentUrl} className="h-24 rounded-lg object-cover border border-gray-200" controls muted />
          ) : (
            <img src={currentUrl} alt="" className="h-24 rounded-lg object-cover border border-gray-200" />
          )}
          <button
            onClick={() => onUpload("")}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Upload бүс */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors
          ${uploading ? "border-cyan-300 bg-cyan-50" : "border-gray-200 hover:border-cyan-400 hover:bg-cyan-50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-cyan-600 text-sm">
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400 text-sm">
            <div className="flex gap-2">
              {(type === "image" || type === "both") && <Image size={18} />}
              {(type === "video" || type === "both") && <Video size={18} />}
              <Upload size={18} />
            </div>
            <span>Файл чирж оруулах эсвэл дарж сонгох</span>
            <span className="text-xs text-gray-300">
              {type === "image" ? "JPG, PNG, WEBP (max 10MB)" :
               type === "video" ? "MP4, MOV (max 100MB)" :
               "Зураг 10MB / Бичлэг 100MB"}
            </span>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("site");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) {
      setLoading(true);
      getSiteData().then(d => { setData(d); setLoading(false); });
    }
  }, [authed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Server-side шалгалт хийх
    const res = await fetch("/api/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pass },
      body: JSON.stringify({}),
    });
    if (res.status === 401) { setPassError(true); return; }
    setAdminPassword(pass);
    setAuthed(true);
    setPassError(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaveError("");
    const ok = await saveSiteData(data);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setSaveError("Хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleReset = async () => {
    if (confirm("Бүх мэдээллийг анхны хэлбэрт нь оруулах уу?")) {
      await resetSiteData();
      const d = await getSiteData();
      setData(d);
    }
  };

  const update = (path: string, value: unknown) => {
    if (!data) return;
    const keys = path.split(".");
    const newData = { ...data } as Record<string, unknown>;
    let cur = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      cur[keys[i]] = { ...(cur[keys[i]] as Record<string, unknown>) };
      cur = cur[keys[i]] as Record<string, unknown>;
    }
    cur[keys[keys.length - 1]] = value;
    setData(newData as unknown as SiteData);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-teal-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900">Нэвтрэх</h1>
            <p className="text-gray-400 text-sm mt-1">Admin хуудас</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Нууц үг</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Нууц үг оруулна уу"
                className={`w-full border ${passError ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100`} />
              {passError && <p className="text-red-500 text-xs mt-1">Нууц үг буруу байна.</p>}
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-bold transition-colors">
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-cyan-700 font-medium">MongoDB-с уншиж байна...</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "site", label: "Ерөнхий", icon: <Settings size={16} /> },
    { id: "hero", label: "Баннер", icon: <Layout size={16} /> },
    { id: "stats", label: "Статистик", icon: <Globe size={16} /> },
    { id: "about", label: "Тухай", icon: <Briefcase size={16} /> },
    { id: "services", label: "Үйлчилгээ", icon: <Briefcase size={16} /> },
    { id: "doctors", label: "Эмч нар", icon: <Users size={16} /> },
    { id: "schedule", label: "Хуваарь", icon: <Clock size={16} /> },
    { id: "testimonials", label: "Сэтгэгдэл", icon: <MessageSquare size={16} /> },
    { id: "nav", label: "Цэс", icon: <Layout size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🏥</span>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 truncate">Удирдах самбар</div>
              <div className="text-xs text-gray-400 hidden sm:block">MongoDB • Cloudinary</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-700 border border-gray-200 px-3 sm:px-4 py-2 rounded-lg transition-colors">
              <Eye size={15} /> <span className="hidden sm:inline">Сайт харах</span>
            </a>
            <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 border border-gray-200 px-3 sm:px-4 py-2 rounded-lg transition-colors">
              <RefreshCw size={15} /> <span className="hidden sm:inline">Reset</span>
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 text-sm text-white px-3 sm:px-5 py-2 rounded-lg font-semibold transition-all ${saved ? "bg-green-500" : saving ? "bg-cyan-400" : "bg-cyan-600 hover:bg-cyan-700"}`}>
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              <span className="hidden sm:inline">{saved ? "Хадгалагдлаа ✓" : saving ? "Хадгалж байна..." : "Хадгалах"}</span>
            </button>
          </div>
        </div>
        {saveError && (
          <div className="bg-red-50 border-t border-red-200 px-6 py-2 text-red-600 text-sm">{saveError}</div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto md:overflow-visible shadow-sm flex md:block">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 md:w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all text-left whitespace-nowrap border-b-0 md:border-b border-r md:border-r-0 border-gray-50 last:border-0 ${activeTab === tab.id ? "bg-cyan-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 min-w-0">

          {/* ЕРӨНХИЙ */}
          {activeTab === "site" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ерөнхий мэдээлэл</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Эмнэлгийн нэр" value={data.site.name} onChange={v => update("site.name", v)} placeholder="МедКлиник" />
                <Field label="Лого (emoji)" value={data.site.logo} onChange={v => update("site.logo", v)} placeholder="🏥" />
                <Field label="Утасны дугаар" value={data.site.phone} onChange={v => update("site.phone", v)} placeholder="+976 7700-0000" />
                <Field label="Имэйл" value={data.site.email} onChange={v => update("site.email", v)} placeholder="info@medclinic.mn" />
                <Field label="Ажлын цаг" value={data.site.workingHours} onChange={v => update("site.workingHours", v)} placeholder="Да-Ба: 08:00-18:00" />
                <Field label="Яаралтай тусламж текст" value={data.site.emergencyText} onChange={v => update("site.emergencyText", v)} />
              </div>
              <Field label="Хаяг байршил" value={data.site.address} onChange={v => update("site.address", v)} placeholder="Улаанбаатар хот..." />
              <Field label="Уриа үг" value={data.site.tagline} onChange={v => update("site.tagline", v)} />
            </div>
          )}

          {/* БАННЕР */}
          {activeTab === "hero" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Баннер (Hero хэсэг)</h2>
              <Field label="Жижиг тайлбар текст" value={data.hero.badge} onChange={v => update("hero.badge", v)} />
              <Field label="Гол гарчиг" value={data.hero.title} onChange={v => update("hero.title", v)} />
              <Field label="Дэлгэрэнгүй тайлбар" value={data.hero.description} onChange={v => update("hero.description", v)} type="textarea" />
              <div className="grid md:grid-cols-2 gap-5 pt-2 border-t">
                <MediaUpload
                  label="Hero зураг"
                  currentUrl={data.hero.imageUrl}
                  onUpload={url => update("hero.imageUrl", url)}
                  type="image"
                  folder="medclinic/hero"
                  adminPass={pass}
                />
                <MediaUpload
                  label="Hero бичлэг (видео)"
                  currentUrl={data.hero.videoUrl}
                  onUpload={url => update("hero.videoUrl", url)}
                  type="video"
                  folder="medclinic/hero"
                  adminPass={pass}
                />
              </div>
            </div>
          )}

          {/* СТАТИСТИК */}
          {activeTab === "stats" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Статистик тоо</h2>
              <div className="space-y-3">
                {data.stats.map((stat, i) => (
                  <div key={i} className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <input value={stat.value} onChange={e => { const s = [...data.stats]; s[i] = { ...s[i], value: e.target.value }; update("stats", s); }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-cyan-500 mb-2" placeholder="25+" />
                      <input value={stat.label} onChange={e => { const s = [...data.stats]; s[i] = { ...s[i], label: e.target.value }; update("stats", s); }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Тайлбар" />
                    </div>
                    <button onClick={() => update("stats", data.stats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={() => update("stats", [...data.stats, { value: "0+", label: "Шинэ үзүүлэлт" }])}
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold text-sm mt-2">
                  <Plus size={15} /> Нэмэх
                </button>
              </div>
            </div>
          )}

          {/* ТУХАЙ */}
          {activeTab === "about" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Бидний тухай хэсэг</h2>
              <Field label="Гарчиг" value={data.about.title} onChange={v => update("about.title", v)} />
              <Field label="Тайлбар" value={data.about.description} onChange={v => update("about.description", v)} type="textarea" />
              <MediaUpload
                label="About хэсгийн зураг"
                currentUrl={data.about.imageUrl}
                onUpload={url => update("about.imageUrl", url)}
                type="image"
                folder="medclinic/about"
                adminPass={pass}
              />
              <div className="border-t pt-5">
                <h3 className="font-semibold text-gray-700 mb-3">1-р онцлог</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Гарчиг" value={data.about.feature1Title} onChange={v => update("about.feature1Title", v)} />
                  <Field label="Тайлбар" value={data.about.feature1Text} onChange={v => update("about.feature1Text", v)} />
                </div>
              </div>
              <div className="border-t pt-5">
                <h3 className="font-semibold text-gray-700 mb-3">2-р онцлог</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Гарчиг" value={data.about.feature2Title} onChange={v => update("about.feature2Title", v)} />
                  <Field label="Тайлбар" value={data.about.feature2Text} onChange={v => update("about.feature2Text", v)} />
                </div>
              </div>
            </div>
          )}

          {/* ҮЙЛЧИЛГЭЭ */}
          {activeTab === "services" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Үйлчилгээнүүд</h2>
                <button onClick={() => update("services", [...data.services, { id: Date.now(), title: "Шинэ үйлчилгээ", description: "Тайлбар", icon: "🏥" }])}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700">
                  <Plus size={15} /> Нэмэх
                </button>
              </div>
              <div className="space-y-4">
                {data.services.map((svc, i) => (
                  <div key={svc.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">{svc.title}</span>
                      <button onClick={() => update("services", data.services.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Icon (emoji)</label>
                        <input value={svc.icon} onChange={e => { const s = [...data.services]; s[i] = { ...s[i], icon: e.target.value }; update("services", s); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Нэр</label>
                        <input value={svc.title} onChange={e => { const s = [...data.services]; s[i] = { ...s[i], title: e.target.value }; update("services", s); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Тайлбар</label>
                        <input value={svc.description} onChange={e => { const s = [...data.services]; s[i] = { ...s[i], description: e.target.value }; update("services", s); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                    </div>
                    <MediaUpload
                      label="Үйлчилгээний зураг (заавал биш)"
                      currentUrl={svc.imageUrl}
                      onUpload={url => { const s = [...data.services]; s[i] = { ...s[i], imageUrl: url }; update("services", s); }}
                      type="image"
                      folder="medclinic/services"
                      adminPass={pass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ЭМЧНАР */}
          {activeTab === "doctors" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Эмч нар</h2>
                <button onClick={() => update("doctors", [...data.doctors, { id: Date.now(), name: "Д-р Шинэ Эмч", specialty: "Мэргэжил", experience: "0 жил" }])}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700">
                  <Plus size={15} /> Нэмэх
                </button>
              </div>
              <div className="space-y-4">
                {data.doctors.map((doc, i) => (
                  <div key={doc.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">{doc.name}</span>
                      <button onClick={() => update("doctors", data.doctors.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      {(["name", "specialty", "experience"] as const).map(field => (
                        <div key={field}>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {field === "name" ? "Нэр" : field === "specialty" ? "Мэргэжил" : "Туршлага"}
                          </label>
                          <input value={doc[field]} onChange={e => { const d = [...data.doctors]; d[i] = { ...d[i], [field]: e.target.value }; update("doctors", d); }}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                      ))}
                    </div>
                    <MediaUpload
                      label="Эмчийн зураг"
                      currentUrl={doc.imageUrl}
                      onUpload={url => { const d = [...data.doctors]; d[i] = { ...d[i], imageUrl: url }; update("doctors", d); }}
                      type="image"
                      folder="medclinic/doctors"
                      adminPass={pass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ХУВААРЬ */}
          {activeTab === "schedule" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Цагийн хуваарь</h2>
                <button onClick={() => update("schedule", [...data.schedule, { day: "Шинэ өдөр", hours: "08:00 – 17:00" }])}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700">
                  <Plus size={15} /> Нэмэх
                </button>
              </div>
              <div className="space-y-3">
                {data.schedule.map((s, i) => (
                  <div key={i} className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl">
                    <input value={s.day} onChange={e => { const sc = [...data.schedule]; sc[i] = { ...sc[i], day: e.target.value }; update("schedule", sc); }}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Өдөр" />
                    <input value={s.hours} onChange={e => { const sc = [...data.schedule]; sc[i] = { ...sc[i], hours: e.target.value }; update("schedule", sc); }}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Цаг" />
                    <button onClick={() => update("schedule", data.schedule.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* СЭТГЭГДЭЛ */}
          {activeTab === "testimonials" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Өвчтөний сэтгэгдэл</h2>
                <button onClick={() => update("testimonials", [...data.testimonials, { id: Date.now(), name: "Шинэ Хүн", text: "Маш сайн үйлчилгээ...", rating: 5 }])}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700">
                  <Plus size={15} /> Нэмэх
                </button>
              </div>
              <div className="space-y-4">
                {data.testimonials.map((t, i) => (
                  <div key={t.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">{t.name}</span>
                      <button onClick={() => update("testimonials", data.testimonials.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Нэр</label>
                        <input value={t.name} onChange={e => { const ts = [...data.testimonials]; ts[i] = { ...ts[i], name: e.target.value }; update("testimonials", ts); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Үнэлгээ (1-5)</label>
                        <input type="number" min={1} max={5} value={t.rating} onChange={e => { const ts = [...data.testimonials]; ts[i] = { ...ts[i], rating: Number(e.target.value) }; update("testimonials", ts); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Сэтгэгдэл</label>
                        <input value={t.text} onChange={e => { const ts = [...data.testimonials]; ts[i] = { ...ts[i], text: e.target.value }; update("testimonials", ts); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* НАВИГАЦИ */}
          {activeTab === "nav" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Навигацийн цэс</h2>
                <button onClick={() => update("nav", [...data.nav, { label: "Шинэ цэс", href: "#" }])}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700">
                  <Plus size={15} /> Нэмэх
                </button>
              </div>
              <div className="space-y-3">
                {data.nav.map((n, i) => (
                  <div key={i} className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl">
                    <input value={n.label} onChange={e => { const nav = [...data.nav]; nav[i] = { ...nav[i], label: e.target.value }; update("nav", nav); }}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Нэр" />
                    <input value={n.href} onChange={e => { const nav = [...data.nav]; nav[i] = { ...nav[i], href: e.target.value }; update("nav", nav); }}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Link (#about)" />
                    <button onClick={() => update("nav", data.nav.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
