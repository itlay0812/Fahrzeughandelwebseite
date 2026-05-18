interface GisslerBrandingProps {
  /** Optional link target – e.g. "https://gissler-webdesign.de" */
  href?: string;
  className?: string;
}

export default function GisslerBranding({ href, className = "" }: GisslerBrandingProps) {
  const inner = (
    <div className={`flex items-center gap-2.5 mb-0.5 ${className}`}>
      <svg
        width="104"
        height="107"
        viewBox="0 0 104 107"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 2xl:h-9 w-auto opacity-80"
        aria-hidden="true"
      >
        <path
          d="M43.926 70.4999L24.4631 60.5459L5.00066 50.5919L5.00066 28.0012L50.9316 5.00121M5.00066 28.0012L27.9657 39.2963L50.9316 50.5919L56.5653 47.768L62.1991 44.9441L73.4666 39.2963L96.0015 28.0012L72.8216 16.5312L62.3766 21.8362L51.9316 27.1412M98.8799 83.787L98.8719 67.5M5.00066 73.5L32.2135 87.75L59.4268 102L59.4309 96.9999L59.4242 92.0105L59.4176 87.0212L59.4176 65L98.872 45.2293L98.8719 67.5M59.4176 87.0212L98.8719 67.5"
          stroke="#006999"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="text-[18px] sm:text-[20px] 2xl:text-[22px] font-semibold"
        style={{
          background: "linear-gradient(135deg, #4dbef3, #006999)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        G&A Webdesign
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transition-opacity hover:opacity-70"
        aria-label="G&A Webdesign"
      >
        {inner}
      </a>
    );
  }

  return inner;
}
