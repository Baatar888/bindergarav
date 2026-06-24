"use client";
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, ChevronRight, Star, Menu, X, Calendar, Shield, Award } from "lucide-react";
import { getSiteData } from "@/lib/store";
import { SiteData } from "@/lib/data";

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // MongoDB API-аас дата татах
    getSiteData().then(d => setData(d));
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-cyan-50"><div className="text-cyan-700 text-xl font-semibold">Уншиж байна...</div></div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setAppointmentOpen(false); setSubmitted(false); setForm({ name: "", phone: "", service: "", date: "" }); }, 2000);
  };

  const docColors = ["bg-cyan-100 text-cyan-800", "bg-teal-100 text-teal-800", "bg-blue-100 text-blue-800", "bg-indigo-100 text-indigo-800"];
  const serviceColors = [
    "from-blue-500 to-cyan-500",
    "from-red-500 to-pink-500",
    "from-green-500 to-teal-500",
    "from-purple-500 to-violet-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-blue-500",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-cyan-900 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <a href={`tel:${data.site.phone}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Phone size={13} /> {data.site.phone}
            </a>
            <a href={`mailto:${data.site.email}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Mail size={13} /> {data.site.email}
            </a>
            <span className="flex items-center gap-1.5 text-cyan-200">
              <MapPin size={13} /> {data.site.address}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
            <Clock size={13} /> {data.site.emergencyText}
          </div>
        </div>
      </div>

      {/* Header / Nav */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.site.logo}</span>
            <div>
              <div className="font-bold text-cyan-800 text-xl leading-tight">{data.site.name}</div>
              <div className="text-xs text-gray-400 hidden sm:block">{data.site.tagline}</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {data.nav.map((item) => (
              <a key={item.label} href={item.href} className="text-gray-600 hover:text-cyan-700 font-medium transition-colors text-sm">{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setAppointmentOpen(true)} className="hidden sm:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm">
              <Calendar size={15} /> Цаг захиалах
            </button>
            <a href="/admin" className="text-xs text-gray-400 hover:text-cyan-600 transition-colors hidden sm:block">Admin</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-600 hover:text-cyan-700">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            {data.nav.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-cyan-700 font-medium py-1">{item.label}</a>
            ))}
            <button onClick={() => { setAppointmentOpen(true); setMenuOpen(false); }} className="w-full bg-cyan-600 text-white py-2.5 rounded-lg font-semibold text-sm mt-2">Цаг захиалах</button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-700 text-white overflow-hidden min-h-[85vh] flex items-center">
        {/* Pattern bg */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-32 h-32 rounded-full border border-white"
              style={{ left: `${(i % 5) * 22}%`, top: `${Math.floor(i / 5) * 28}%`, opacity: 0.3 + (i % 3) * 0.2 }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-700/50 border border-cyan-500/50 rounded-full px-4 py-1.5 text-cyan-200 text-sm font-medium mb-6">
              <Shield size={14} /> {data.hero.badge}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              {data.hero.title}
            </h1>
            <p className="text-cyan-100 text-lg leading-relaxed mb-10 max-w-lg">{data.hero.description}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setAppointmentOpen(true)} className="flex items-center gap-2 bg-white text-cyan-800 hover:bg-cyan-50 px-8 py-4 rounded-xl font-bold text-base shadow-lg transition-all hover:scale-105">
                <Calendar size={18} /> Цаг захиалах
              </button>
              <a href="#services" className="flex items-center gap-2 border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10">
                Үйлчилгээ харах <ChevronRight size={18} />
              </a>
            </div>
          </div>
          {/* Quick info cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <Phone className="mx-auto mb-3 text-cyan-300" size={28} />
              <div className="font-bold text-lg">{data.site.phone}</div>
              <div className="text-cyan-300 text-sm mt-1">Утасны дугаар</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <Clock className="mx-auto mb-3 text-cyan-300" size={28} />
              <div className="font-bold text-base">{data.site.workingHours}</div>
              <div className="text-cyan-300 text-sm mt-1">Цагийн хуваарь</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center col-span-2">
              <MapPin className="mx-auto mb-3 text-cyan-300" size={28} />
              <div className="font-bold">{data.site.address}</div>
              <div className="text-cyan-300 text-sm mt-1">Хаяг байршил</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stats.map((stat, i) => (
            <div key={i} className="text-center p-4 border-r border-gray-100 last:border-0">
              <div className="text-4xl font-black text-cyan-700">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-3">Бидний тухай</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{data.about.title}</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">{data.about.description}</p>
            <div className="space-y-5">
              <div className="flex gap-4 items-start p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="text-cyan-600" size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 mb-1">{data.about.feature1Title}</div>
                  <div className="text-gray-500 text-sm">{data.about.feature1Text}</div>
                </div>
              </div>
              <div className="flex gap-4 items-start p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-teal-600" size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 mb-1">{data.about.feature2Title}</div>
                  <div className="text-gray-500 text-sm">{data.about.feature2Text}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Schedule */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-700 to-teal-600 text-white p-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Clock size={20} /> Цагийн хуваарь</h3>
              <p className="text-cyan-200 text-sm mt-1">Ажиллах цагийн хуваарь</p>
            </div>
            <div className="p-6 space-y-3">
              {data.schedule.map((s, i) => (
                <div key={i} className={`flex justify-between items-center p-3 rounded-lg ${s.hours === "Амарна" ? "bg-red-50" : "bg-gray-50"}`}>
                  <span className="font-medium text-gray-700">{s.day}</span>
                  <span className={`font-bold ${s.hours === "Амарна" ? "text-red-500" : "text-cyan-700"}`}>{s.hours}</span>
                </div>
              ))}
              <button onClick={() => setAppointmentOpen(true)} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-bold transition-colors">
                Цаг захиалах
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-3">Манай үйлчилгээ</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Эмнэлгийн тасгийн үйлчилгээ</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Иж бүрэн эмнэлгийн тусламж, оношилгоо, эмчилгээний үйлчилгээ</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.map((service, i) => (
              <div key={service.id} className="group border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${serviceColors[i % serviceColors.length]} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                <a href="#contact" className="inline-flex items-center gap-1 text-cyan-600 font-semibold text-sm hover:gap-2 transition-all">
                  Дэлгэрэнгүй <ChevronRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-3">Манай баг</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Мэргэжлийн эмч нар</h2>
            <p className="text-gray-500">Туршлагатай, халамжтай мэргэжлийн эмч нарын баг</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.doctors.map((doc, i) => (
              <div key={doc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className={`h-36 flex items-center justify-center text-6xl ${docColors[i % docColors.length]}`}>
                  👨‍⚕️
                </div>
                <div className="p-5">
                  <div className="font-bold text-gray-900 text-base">{doc.name}</div>
                  <div className="text-cyan-600 text-sm font-medium mt-0.5">{doc.specialty}</div>
                  <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-xs">
                    <Award size={13} /> {doc.experience} туршлага
                  </div>
                  <button className="w-full mt-4 border border-cyan-200 text-cyan-700 hover:bg-cyan-600 hover:text-white py-2 rounded-lg text-sm font-semibold transition-all">
                    Цаг захиалах
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-3">Санал хүсэлт</div>
            <h2 className="text-3xl font-bold text-gray-900">Өвчтөнүүдийн сэтгэгдэл</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.testimonials.map((t) => (
              <div key={t.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-5 text-sm">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-cyan-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Өнөөдөр цаг захиалаарай</h2>
          <p className="text-cyan-200 mb-8 text-lg">Эрүүл мэндийн асуудлаа хойш тавьж болохгүй. Манай мэргэжлийн эмч нар таны хүлээж байна.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setAppointmentOpen(true)} className="bg-white text-cyan-800 hover:bg-cyan-50 px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:scale-105">
              Цаг захиалах
            </button>
            <a href={`tel:${data.site.phone}`} className="flex items-center gap-2 border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-xl font-semibold transition-all">
              <Phone size={18} /> {data.site.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-3">Холбоо барих</div>
            <h2 className="text-3xl font-bold text-gray-900">Бидэнтэй холбогдох</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Phone size={24} />, label: "Утас", value: data.site.phone, color: "bg-cyan-100 text-cyan-700" },
              { icon: <Mail size={24} />, label: "Имэйл", value: data.site.email, color: "bg-teal-100 text-teal-700" },
              { icon: <MapPin size={24} />, label: "Хаяг", value: data.site.address, color: "bg-blue-100 text-blue-700" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <div className="text-gray-400 text-sm mb-2 font-medium">{item.label}</div>
                <div className="font-bold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{data.site.logo}</span>
              <span className="text-white font-bold text-xl">{data.site.name}</span>
            </div>
            <p className="text-sm leading-relaxed">{data.site.tagline}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Үйлчилгээ</h4>
            <div className="space-y-2 text-sm">
              {data.services.slice(0, 4).map((s) => (
                <div key={s.id} className="hover:text-white cursor-pointer transition-colors">{s.title}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Холбоо барих</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone size={14} /> {data.site.phone}</div>
              <div className="flex items-center gap-2"><Mail size={14} /> {data.site.email}</div>
              <div className="flex items-center gap-2"><MapPin size={14} /> {data.site.address}</div>
              <div className="flex items-center gap-2"><Clock size={14} /> {data.site.workingHours}</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <div>© 2025 {data.site.name}. Бүх эрх хуулиар хамгаалагдсан.</div>
          <a href="/admin" className="text-cyan-400 hover:text-cyan-300 transition-colors">Удирдах самбар →</a>
        </div>
      </footer>

      {/* Appointment Modal */}
      {appointmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-cyan-700 to-teal-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Цаг захиалах</h3>
                <p className="text-cyan-200 text-sm mt-0.5">Мэдээллээ оруулна уу</p>
              </div>
              <button onClick={() => setAppointmentOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <div className="text-xl font-bold text-gray-800 mb-2">Амжилттай захиалагдлаа!</div>
                  <div className="text-gray-500">Бид тантай удахгүй холбогдох болно.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Таны нэр *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                      placeholder="Бүтэн нэрээ оруулна уу" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Утасны дугаар *</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                      placeholder="+976 XXXX-XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Үйлчилгээний төрөл</label>
                    <select value={form.service} onChange={e => setForm({...form, service: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all">
                      <option value="">Сонгоно уу...</option>
                      {data.services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Хүсэлт огноо</label>
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all" />
                  </div>
                  <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-cyan-200">
                    Цаг захиалах
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
