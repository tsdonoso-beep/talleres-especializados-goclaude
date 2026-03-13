import { useEffect, useRef } from "react";

interface Props {
  images: string[];
  tallerNombre: string;
}

export function RepositorioImageSlide({ images, tallerNombre }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let pos = 0;

    const step = () => {
      pos += 0.3; // velocidad lenta
      if (pos >= el.scrollHeight / 2) pos = 0;
      el.scrollTop = pos;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Duplicamos imágenes para loop infinito
  const allImages = [...images, ...images];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "20px 0 0 20px",
      }}
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        style={{
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 12,
        }}
      >
        {allImages.map((src, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              borderRadius: 14,
              overflow: "hidden",
              aspectRatio: "4/3",
            }}
          >
            <img
              src={src}
              alt={`${tallerNombre} ${(i % images.length) + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlays arriba y abajo para suavizar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "linear-gradient(to bottom, hsl(155 60% 97%), transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "linear-gradient(to top, hsl(155 60% 97%), transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}
