import React, { useEffect, useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Building2,
  Tent,
  Users,
  Star,
  HardHat,
  Camera,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { cn } from "../lib/utils";

// ─── Interfaces ───────────────────────────────────────────────────────────────
type GalleryCategory = "All" | "Facilities" | "Health Camps" | "Staff" | "Events" | "Infrastructure";

interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  date: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  tall?: boolean; // for masonry variation
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const galleryItems: GalleryItem[] = [
  // Facilities (6)
  {
    id: 1, title: "Emergency Ward", category: "Facilities", date: "March 2026",
    gradientFrom: "#1e3a8a", gradientTo: "#2563eb",
    icon: <Building2 size={32} className="text-white/70" />,
    tall: true,
  },
  {
    id: 2, title: "OPD Registration Hall", category: "Facilities", date: "March 2026",
    gradientFrom: "#0f766e", gradientTo: "#0d9488",
    icon: <Building2 size={32} className="text-white/70" />,
  },
  {
    id: 3, title: "Pharmacy Counter", category: "Facilities", date: "February 2026",
    gradientFrom: "#7c3aed", gradientTo: "#5b21b6",
    icon: <Building2 size={32} className="text-white/70" />,
    tall: true,
  },
  {
    id: 4, title: "Laboratory", category: "Facilities", date: "February 2026",
    gradientFrom: "#0284c7", gradientTo: "#0369a1",
    icon: <Building2 size={32} className="text-white/70" />,
  },
  {
    id: 5, title: "Maternity Ward", category: "Facilities", date: "January 2026",
    gradientFrom: "#db2777", gradientTo: "#be185d",
    icon: <Building2 size={32} className="text-white/70" />,
  },
  {
    id: 6, title: "Dental Chair", category: "Facilities", date: "January 2026",
    gradientFrom: "#059669", gradientTo: "#047857",
    icon: <Building2 size={32} className="text-white/70" />,
    tall: true,
  },
  // Health Camps (4)
  {
    id: 7, title: "Eye Camp 2025", category: "Health Camps", date: "December 2025",
    gradientFrom: "#2563eb", gradientTo: "#0d9488",
    icon: <Tent size={32} className="text-white/70" />,
    tall: true,
  },
  {
    id: 8, title: "School Health Drive", category: "Health Camps", date: "June 2026",
    gradientFrom: "#ea580c", gradientTo: "#d97706",
    icon: <Tent size={32} className="text-white/70" />,
  },
  {
    id: 9, title: "Diabetes Screening", category: "Health Camps", date: "June 2026",
    gradientFrom: "#0d9488", gradientTo: "#065f46",
    icon: <Tent size={32} className="text-white/70" />,
  },
  {
    id: 10, title: "Maternal Health Camp", category: "Health Camps", date: "April 2026",
    gradientFrom: "#db2777", gradientTo: "#9333ea",
    icon: <Tent size={32} className="text-white/70" />,
    tall: true,
  },
  // Staff (3)
  {
    id: 11, title: "Medical Team", category: "Staff", date: "May 2026",
    gradientFrom: "#1e3a8a", gradientTo: "#7c3aed",
    icon: <Users size={32} className="text-white/70" />,
    tall: true,
  },
  {
    id: 12, title: "Nursing Staff", category: "Staff", date: "May 2026",
    gradientFrom: "#0284c7", gradientTo: "#0d9488",
    icon: <Users size={32} className="text-white/70" />,
  },
  {
    id: 13, title: "Lab Technicians", category: "Staff", date: "April 2026",
    gradientFrom: "#059669", gradientTo: "#0d9488",
    icon: <Users size={32} className="text-white/70" />,
  },
  // Events (3)
  {
    id: 14, title: "Kayakalp Award Ceremony", category: "Events", date: "January 2026",
    gradientFrom: "#d97706", gradientTo: "#b45309",
    icon: <Star size={32} className="text-white/70" />,
    tall: true,
  },
  {
    id: 15, title: "Independence Day Health Walk", category: "Events", date: "August 2025",
    gradientFrom: "#16a34a", gradientTo: "#15803d",
    icon: <Star size={32} className="text-white/70" />,
  },
  {
    id: 16, title: "World Health Day", category: "Events", date: "April 2026",
    gradientFrom: "#0ea5e9", gradientTo: "#0284c7",
    icon: <Star size={32} className="text-white/70" />,
  },
  // Infrastructure (2)
  {
    id: 17, title: "Building Exterior", category: "Infrastructure", date: "March 2026",
    gradientFrom: "#475569", gradientTo: "#334155",
    icon: <HardHat size={32} className="text-white/70" />,
    tall: true,
  },
  {
    id: 18, title: "Solar Panel Installation", category: "Infrastructure", date: "February 2026",
    gradientFrom: "#f59e0b", gradientTo: "#d97706",
    icon: <HardHat size={32} className="text-white/70" />,
  },
];

const CATEGORIES: GalleryCategory[] = ["All", "Facilities", "Health Camps", "Staff", "Events", "Infrastructure"];

const categoryColors: Record<GalleryCategory, string> = {
  All: "badge-blue",
  Facilities: "badge-blue",
  "Health Camps": "badge-teal",
  Staff: "badge-green",
  Events: "badge-amber",
  Infrastructure: "badge-red",
};

// ─── useIntersection ──────────────────────────────────────────────────────────
function useIntersection(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, currentIndex, onClose, onPrev, onNext }) => {
  const item = items[currentIndex];

  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Large placeholder image area */}
        <div
          className="relative w-full flex flex-col items-center justify-center"
          style={{
            height: 420,
            background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
          }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              {item.icon}
            </div>
            <Camera size={20} className="text-white/40" />
            <span className="text-white/40 text-sm font-medium">Photo Placeholder</span>
          </div>

          {/* Category badge overlay */}
          <div className="absolute top-4 left-4">
            <span className={cn(categoryColors[item.category])}>
              {item.category}
            </span>
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 text-white text-xs font-medium">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-white px-6 py-5">
          <h3 className="text-xl font-bold font-display text-slate-900">{item.title}</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm text-slate-500">{item.category}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm text-slate-400">{item.date}</span>
          </div>
        </div>

        {/* Prev / Next */}
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-14 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all"
          aria-label="Close"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
};

// ─── Gallery Item Card ────────────────────────────────────────────────────────
interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  visible: boolean;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, index, visible, onClick }) => (
  <div
    className={cn(
      "group relative rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all duration-700 break-inside-avoid mb-4",
      item.tall ? "h-72" : "h-48",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}
    style={{ transitionDelay: `${index * 60}ms` }}
    onClick={onClick}
  >
    {/* Gradient background */}
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}
    />
    {/* Dot grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    />

    {/* Center icon */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
      <div className="w-14 h-14 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
        {item.icon}
      </div>
    </div>

    {/* Bottom label (always visible) */}
    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-10"
      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}>
      <p className="text-white text-sm font-semibold leading-snug line-clamp-1">{item.title}</p>
      <span className="text-white/60 text-xs">{item.date}</span>
    </div>

    {/* Category badge */}
    <div className="absolute top-3 left-3 z-10">
      <span className={cn(categoryColors[item.category])}>
        {item.category}
      </span>
    </div>

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
      <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
        <ZoomIn size={20} className="text-white" />
      </div>
    </div>
  </div>
);

// ─── Main Gallery Page ────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { ref, visible } = useIntersection(0.05);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevItem = useCallback(() =>
    setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const nextItem = useCallback(() =>
    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % filtered.length)),
    [filtered.length]
  );

  return (
    <>
      <Helmet>
        <title>Photo Gallery — CHC Bharno | Healthcare Facilities in Gumla, Jharkhand</title>
        <meta
          name="description"
          content="Browse photos of CHC Bharno's facilities, health camps, staff, and events. See our emergency ward, maternity ward, pharmacy, and more."
        />
        <meta
          name="keywords"
          content="CHC Bharno Gallery, Bharno Hospital Photos, Health Camp Photos, Gumla Hospital Facilities"
        />
      </Helmet>

      <main>
        <PageHeader
          title="Photo Gallery"
          subtitle="A visual journey through our facilities, health camps, dedicated staff, and community events."
          badge="CHC Bharno in Pictures"
          breadcrumbs={[{ label: "Gallery" }]}
        />

        {/* Category filter pills */}
        <section className="py-10 bg-white border-b border-slate-100 sticky top-16 z-30">
          <div className="page-container">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-sm font-medium text-slate-500 mr-1 whitespace-nowrap">Filter:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                    activeCategory === cat
                      ? "text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                  style={
                    activeCategory === cat
                      ? { background: "linear-gradient(135deg, #2563eb, #0d9488)" }
                      : {}
                  }
                >
                  {cat}
                  {cat !== "All" && (
                    <span className={cn(
                      "ml-1.5 text-xs opacity-70",
                    )}>
                      ({galleryItems.filter((i) => i.category === cat).length})
                    </span>
                  )}
                  {cat === "All" && (
                    <span className="ml-1.5 text-xs opacity-70">({galleryItems.length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Masonry Gallery */}
        <section className="section-pad bg-slate-50">
          <div className="page-container">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
                <ImageOff size={48} className="opacity-30" />
                <p className="text-lg font-medium">No photos in this category yet.</p>
              </div>
            ) : (
              <div
                ref={ref}
                className="columns-1 sm:columns-2 lg:columns-3 gap-4"
              >
                {filtered.map((item, i) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={i}
                    visible={visible}
                    onClick={() => openLightbox(i)}
                  />
                ))}
              </div>
            )}

            {/* Count info */}
            {filtered.length > 0 && (
              <p className="text-center text-sm text-slate-400 mt-8">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> photo{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </p>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevItem}
            onNext={nextItem}
          />
        )}
      </main>
    </>
  );
};

export { GalleryPage };
export default GalleryPage;
