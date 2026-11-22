"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [imageIndex, setImageIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-[#e5dce9] bg-[#eee8f2] text-sm text-[#9277a8]">
        Image coming soon
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-[#e5dce9] bg-[#eee8f2]">
        <img
          src={images[imageIndex]}
          alt={`${title} image ${imageIndex + 1}`}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`View image ${index + 1}`}
              onClick={() => setImageIndex(index)}
              className={`overflow-hidden rounded-xl border-2 transition ${
                index === imageIndex
                  ? "border-[#75558c]"
                  : "border-transparent hover:border-[#cbbdd3]"
              }`}
            >
              <img
                src={image}
                alt=""
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
