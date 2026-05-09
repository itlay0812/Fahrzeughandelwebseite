interface GisslerBrandingProps {
  /** Optional link target – e.g. "https://gissler-webdesign.de" */
  href?: string;
  className?: string;
}

export default function GisslerBranding({ href, className = "" }: GisslerBrandingProps) {
  const inner = (
    <div className={`flex items-center gap-2.5 mb-0.5 ${className}`}>
      <svg
        width="101"
        height="89"
        viewBox="0 0 101 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 2xl:h-9 w-auto opacity-80"
        aria-hidden="true"
      >
        <path
          d="M2.79004 46.54L50.2 70.54L97.68 46.55"
          stroke="#006999"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M97.68 61.8601L50.2 85.8501L2.79004 61.8501L2.5 28"
          stroke="#006999"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M49.93 5L5 27.8L49.93 50.59L95 28L71.82 16.53L61.375 21.835L50.93 27.14"
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
        Gissler Webdesign
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
        aria-label="Gissler Webdesign"
      >
        {inner}
      </a>
    );
  }

  return inner;
}
