"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export function ProductImages({ images, name }: { images: string[]; name: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const displayImages = images.length > 0 ? images : ["/placeholder.png"];
  return (
    <div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
      <div className="relative w-full aspect-square bg-gray-50 rounded overflow-hidden mb-4 group">
        <Image src={displayImages[selectedIndex]} alt={`${name} - ${selectedIndex + 1}`} fill className={`object-contain p-6 transition-transform duration-300 ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`} onClick={() => setZoomed(!zoomed)} sizes="(max-width: 768px) 100vw, 50vw" priority />
        {displayImages.length > 1 && (<><button onClick={() => setSelectedIndex((i) => (i - 1 + displayImages.length) % displayImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow"><ChevronLeft size={16} /></button><button onClick={() => setSelectedIndex((i) => (i + 1) % displayImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow"><ChevronRight size={16} /></button></>)}
      </div>
      {displayImages.length > 1 && <div className="flex gap-2 justify-center">{displayImages.map((img, i) => <button key={i} onClick={() => setSelectedIndex(i)} className={`relative w-16 h-16 rounded border-2 overflow-hidden ${i === selectedIndex ? "border-[#2874f0]" : "border-gray-200"}`}><Image src={img} alt={`Thumb ${i + 1}`} fill className="object-contain p-1" sizes="64px" /></button>)}</div>}
    </div>
  );
}
