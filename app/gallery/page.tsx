import type { Metadata } from "next";
import CircularGallery, { type GalleryItem } from "./circular-gallery";

export const metadata: Metadata = {
  title: "Photography Archive — Tonmay",
  description:
    "An immersive archive of portrait, landscape, editorial, and documentary photography by Tonmay.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Photography Archive — Tonmay",
    description:
      "An immersive archive of portrait, landscape, editorial, and documentary photography by Tonmay.",
    url: "/gallery",
    type: "website",
  },
};

const archive: GalleryItem[] = [
  {
    title: "Studio movement",
    category: "Portrait / fashion",
    image: "/images/archive/studio-fashion.webp",
    position: "center 28%",
  },
  {
    title: "Classic portrait",
    category: "Portrait / studio",
    image: "/images/archive/classic-portrait.webp",
    position: "center 27%",
  },
  {
    title: "Field equipment",
    category: "Process / documentary",
    image: "/images/archive/drone-field.webp",
    position: "center",
  },
  {
    title: "Blue line",
    category: "Portrait / environment",
    image: "/images/archive/railway-portrait.webp",
    position: "center 32%",
  },
  {
    title: "Stair study",
    category: "Portrait / monochrome",
    image: "/images/archive/stair-study.webp",
    position: "center",
  },
  {
    title: "Studio noir",
    category: "Portrait / editorial",
    image: "/images/archive/studio-black.webp",
    position: "center",
  },
  {
    title: "Rainier",
    category: "Landscape / Northwest",
    image: "/images/archive/rainier.webp",
    position: "center",
  },
  {
    title: "Seattle after dark",
    category: "City / atmosphere",
    image: "/images/archive/seattle-night.webp",
    position: "center",
  },
  {
    title: "Open smile",
    category: "Portrait / natural light",
    image: "/images/archive/open-smile.webp",
    position: "center 24%",
  },
  {
    title: "Private study",
    category: "Portrait / personal",
    image: "/images/archive/private-portrait.webp",
    position: "center 24%",
  },
];

export default function GalleryPage() {
  return <CircularGallery items={archive} />;
}
