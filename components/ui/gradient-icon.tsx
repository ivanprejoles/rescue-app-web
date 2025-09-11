import { LucideIcon } from "lucide-react"; // or from 'lucide-react'

interface Props {
  Icon: LucideIcon;
}

export default function GradientIcon({ Icon }: Props) {
  return (
    <>
      {/* Define the gradient in a hidden SVG */}
      <svg width="0" height="0">
        <linearGradient id="stripe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor="#1fa2ff" offset="0%" />
          <stop stopColor="#386CB4" offset="50%" />
          <stop stopColor="#a6ffcb" offset="100%" />
        </linearGradient>
      </svg>
      {/* Apply gradient to fill or stroke, depending on icon style */}
      <Icon
        style={{ fill: "url(#stripe-gradient)" }} // use 'fill' instead of 'stroke' if your icon renders as a filled shape
        size={48}
      />
    </>
  );
}
