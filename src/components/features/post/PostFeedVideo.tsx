import { useEffect } from "react";
import styled from "styled-components";

type Variant = "default" | "compact";

type Props = {
  src: string;
  theme: string;
  variant?: Variant;
  autoPlay?: boolean;
  isLCP?: boolean; 
};

const POSTER_SIZES: Record<Variant, { w: number; h: number }> = {
  default: { w: 1038, h: 584 },
  compact: { w: 600, h: 280 },
};

const getPoster = (url: string, variant: Variant = "default") => {
  const { w, h } = POSTER_SIZES[variant];
  return url
    .replace('/upload/', `/upload/w_${w},h_${h},c_fill,f_auto,q_auto,so_0/`)
    .replace(/\.(mp4|webm|mov)$/, '.jpg');
};

export const PostFeedVideo = ({
  src,
  theme,
  variant = "default",
  autoPlay = true,
  isLCP = false,
}: Props) => {
  const poster = getPoster(src, variant);

  useEffect(() => {
    if (!isLCP) return;

    const existing = document.querySelector(`link[data-lcp-poster]`);
    if (existing) return; 

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = poster;
    link.setAttribute('fetchpriority', 'high');
    link.setAttribute('data-lcp-poster', 'true');
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [isLCP, poster]);

  return (
    <Host $theme={theme} $variant={variant}>
      <video
        controls
        muted
        autoPlay={autoPlay}
        poster={poster}
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>
    </Host>
  );
};

const Host = styled.div<{ $theme: string; $variant: Variant }>`
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-radius: ${({ $variant }) => ($variant === "compact" ? "10px" : "16px")};
  overflow: hidden;
  background: transparent;
  line-height: 0;

  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: ${({ $variant }) => ($variant === "compact" ? "10px" : "16px")};
    vertical-align: top;
  }

  ${({ $variant }) =>
    $variant === "compact" ? `
      video { max-height: 280px; object-fit: cover; }
    ` : `
      video { max-height: 400px; }
      @media (max-width: 768px) { video { max-height: 450px; } }
      @media (max-width: 480px) { video { max-height: 350px; } }
    `}
`;
