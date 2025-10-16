import React, { useState, useEffect, useCallback, useRef, JSX } from "react";

interface VideoMaskProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "auto" | "metadata" | "none";
  fontSize?: string | number;
  fontWeight?: string | number;
  textAnchor?: "start" | "middle" | "end";
  dominantBaseline?:
    | "auto"
    | "text-bottom"
    | "alphabetic"
    | "middle"
    | "central"
    | "mathematical"
    | "text-after-edge"
    | "ideographic"
    | "hanging"
    | "text-before-edge";
  fontFamily?: string;
  as?: keyof JSX.IntrinsicElements;
  content?: string | string[];
}

const VideoText: React.FC<VideoMaskProps> = ({
  src,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 12,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as: Component = "div",
  content = "",
}) => {
  const [dataUrlMask, setDataUrlMask] = useState("");
  const resizeTimeoutRef = useRef<number | null>(null);

  // Convert content array to string if needed
  const dynamicContent = Array.isArray(content) ? content.join("") : content;

  // Function to generate the SVG mask data URL
  const updateSvgMask = useCallback(() => {
    const responsiveFontSize =
      typeof fontSize === "number" ? `${fontSize}vw` : fontSize;

    const svgMask = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <text
        x="50%"
        y="50%"
        font-size="${responsiveFontSize}"
        font-weight="${fontWeight}"
        text-anchor="${textAnchor}"
        dominant-baseline="${dominantBaseline}"
        font-family="${fontFamily}"
      >
        ${dynamicContent}
      </text>
    </svg>`;

    // Encode SVG and prepend `url("data:image/svg+xml, ...")` suitable for CSS mask-image
    const encodedMask = encodeURIComponent(svgMask);
    setDataUrlMask(`url("data:image/svg+xml,${encodedMask}")`);
  }, [
    dynamicContent,
    fontSize,
    fontWeight,
    textAnchor,
    dominantBaseline,
    fontFamily,
  ]);

  // On mount and whenever dependencies change, update mask
  useEffect(() => {
    updateSvgMask();
  }, [updateSvgMask]);

  // Update mask on window resize, debounced
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current)
        window.clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateSvgMask();
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (resizeTimeoutRef.current)
        window.clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateSvgMask]);

  // Inline styles applying the mask with vendor prefixes
  const maskStyle: React.CSSProperties = {
    maskImage: dataUrlMask,
    WebkitMaskImage: dataUrlMask,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return React.createElement(
    Component,
    { className: `relative w-full h-full ${className}` },
    <>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={maskStyle}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Accessibility: hidden text for screen readers */}
      <span className="sr-only">{dynamicContent}</span>
    </>
  );
};

export default VideoText;
