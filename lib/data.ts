export interface SiteData {
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
    imageUrl?: string;   // Hero зураг
    videoUrl?: string;   // Hero бичлэг
  };
  stats: Array<{ value: string; label: string }>;
  about: {
    title: string;
    description: string;
    imageUrl?: string;   // About хэсгийн зураг
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

export const defaultData: SiteData = {
  site: {
    name: "МедКлиник",
    logo: "🏥",
    tagline: "Таны эрүүл мэндийн найдвартай түнш",
    phone: "+976 7700-0000",
    email: "info@medclinic.mn",
    address: "Улаанбаатар хот, Сүхбаатар дүүрэг",
    workingHours: "Да-Ба: 08:00-18:00",
    emergencyText: "24 цагийн яаралтай тусламж",
  },
  hero: {
    badge: "Найдвартай эмнэлгийн тусламж",
    title: "Эрүүл мэндийн хамгийн сайн газар",
    description: "Орчин үеийн технологи болон мэргэжлийн эмч нарын багийн хамт таны эрүүл мэндийг хамгаалъя. Бид 25 жилийн туршлагатай.",
    imageUrl: "",
    videoUrl: "",
  },
  stats: [
    { value: "25+", label: "Жилийн туршлага" },
    { value: "150+", label: "Мэргэжлийн эмч" },
    { value: "50,000+", label: "Сэтгэл ханасан өвчтөн" },
    { value: "30+", label: "Тасаг, алба" },
  ],
  about: {
    title: "МедКлиник эмнэлгийн тухай",
    description: "Бид Монголын тэргүүлэх эмнэлгийн байгууллага бөгөөд орчин үеийн оношилгоо, эмчилгээний аргуудыг ашиглан өвчтөн бүрд хамгийн сайн тусламж үзүүлдэг.",
    imageUrl: "",
    feature1Title: "Мэргэшсэн эмч нар",
    feature1Text: "Улс дотоодын шилдэг их сургуулиудад боловсрол эзэмшсэн, олон улсад сургалтад хамрагдсан эмч нар",
    feature2Title: "Урьдчилан сэргийлэх эмнэлэг",
    feature2Text: "Өвчнөөс урьдчилан сэргийлэх, эрт илрүүлэх, цаг тухайд нь эмчлэх цогц хандлага",
  },
  services: [
    { id: 1, title: "Шүдний эмчилгээ", description: "Орчин үеийн тоног төхөөрөмжийг ашиглан шүдний бүх төрлийн эмчилгээ, засал хийдэг.", icon: "🦷" },
    { id: 2, title: "Зүрхний эмчилгээ", description: "Зүрх судасны өвчнийг оношлох, эмчлэх, урьдчилан сэргийлэх иж бүрэн үйлчилгээ.", icon: "❤️" },
    { id: 3, title: "Яс мөчний эмчилгээ", description: "Яс, үе мөч, шөрмөсний гэмтэл, өвчнийг мэргэжлийн түвшинд оношлон эмчилнэ.", icon: "🦴" },
    { id: 4, title: "Нүдний эмчилгээ", description: "Нүдний харааны сорилт, нүдний өвчин, мэс засал хийх иж бүрэн үйлчилгээ.", icon: "👁️" },
    { id: 5, title: "Хүүхдийн эмнэлэг", description: "Хүүхдийн эрүүл мэнд, хөгжлийн үнэлгээ, вакцинжуулалт, өвчний эмчилгээ.", icon: "👶" },
    { id: 6, title: "Мэдрэлийн эмчилгээ", description: "Мэдрэлийн тогтолцооны өвчнийг оношлох, эмчлэх, нөхөн сэргээх үйлчилгээ.", icon: "🧠" },
  ],
  doctors: [
    { id: 1, name: "Д-р Батболд Нямдорж", specialty: "Зүрхний мэс засалч", experience: "18 жил" },
    { id: 2, name: "Д-р Оюунцэцэг Дамдин", specialty: "Хүүхдийн эмч", experience: "12 жил" },
    { id: 3, name: "Д-р Энхтүвшин Галаа", specialty: "Мэдрэл судлаач", experience: "15 жил" },
    { id: 4, name: "Д-р Мөнхбаяр Цэрэн", specialty: "Яс мөчний мэргэжилтэн", experience: "10 жил" },
  ],
  schedule: [
    { day: "Даваа – Пүрэв", hours: "08:00 – 18:00" },
    { day: "Баасан", hours: "09:00 – 17:00" },
    { day: "Бямба", hours: "07:30 – 15:00" },
    { day: "Ням", hours: "Амарна" },
  ],
  testimonials: [
    { id: 1, name: "Болормаа С.", text: "Маш сайн эмч нар, анхаарал халамжтай үйлчилгээ. Хүүхдийнхээ эрүүл мэндийн асуудлаар ирэхэд бүх зүйл маш хурдан шийдэгдсэн.", rating: 5 },
    { id: 2, name: "Ганбаатар М.", text: "Орчин үеийн тоног төхөөрөмж, мэргэшсэн эмч нар. Цагаа баримтлан ажилладаг нь таатай байна.", rating: 5 },
    { id: 3, name: "Номинчимэг Б.", text: "МедКлиникийг найз нартаа зөвлөдөг. Шүдний эмчилгээ маш өвдөлтгүй, мэргэжлийн түвшинд хийгдсэн.", rating: 5 },
  ],
  nav: [
    { label: "Нүүр", href: "/" },
    { label: "Бидний тухай", href: "#about" },
    { label: "Үйлчилгээ", href: "#services" },
    { label: "Эмч нар", href: "#doctors" },
    { label: "Холбоо барих", href: "#contact" },
  ],
};
