import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CAKE_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%" style="background:radial-gradient(circle, %232C140E 0%, %23130604 100%)"><g transform="translate(100, 100)"><rect x="40" y="150" width="220" height="110" rx="20" fill="%23DFB15B" opacity="0.95" stroke="%23ffe082" stroke-width="2"/><rect x="60" y="80" width="180" height="80" rx="15" fill="%23cc7a74" opacity="0.85" stroke="%23ffab91" stroke-width="2"/><circle cx="150" cy="50" r="16" fill="%23ffffff" opacity="0.95" stroke="%23ffffff" stroke-width="2"/><path d="M150,15 L150,40" stroke="%23ffd54f" stroke-width="5" stroke-linecap="round"/><path d="M150,5 Q153,10 150,15 Q147,10 150,5" fill="%23ff9100" stroke="%23ff3d00" stroke-width="1.5"/><circle cx="90" cy="115" r="8" fill="%23e0a0a0"/><circle cx="210" cy="115" r="8" fill="%23e0a0a0"/><path d="M80,205 Q150,230 220,205" fill="none" stroke="%231a0805" stroke-width="6" stroke-linecap="round" opacity="0.45"/></g><text x="50%" y="84%" text-anchor="middle" fill="%23DFB15B" font-family="'Playfair Display', 'Georgia', serif" font-weight="900" font-style="italic" font-size="28" letter-spacing="1.5">Cake Urban</text><text x="50%" y="90%" text-anchor="middle" fill="%23FFFDFB" opacity="0.5" font-family="'Inter', sans-serif" font-weight="900" font-size="12" letter-spacing="4">ARTISANAL BAKERY</text></svg>`;

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = CAKE_FALLBACK_SVG;
}
