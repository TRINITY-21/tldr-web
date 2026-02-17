"use client";

interface OptionsProps {
  length: "brief" | "detailed";
  onLengthChange: (v: "brief" | "detailed") => void;
  bullets: boolean;
  onBulletsChange: (v: boolean) => void;
  lang: string;
  onLangChange: (v: string) => void;
}

const LANGUAGES = [
  "",
  "Spanish",
  "French",
  "German",
  "Turkish",
  "Arabic",
  "Chinese",
  "Japanese",
  "Portuguese",
  "Hindi",
];

export default function Options({
  length,
  onLengthChange,
  bullets,
  onBulletsChange,
  lang,
  onLangChange,
}: OptionsProps) {
  const pill = (active: boolean) =>
    `px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
      active
        ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
        : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onLengthChange("brief")}
        className={pill(length === "brief")}
      >
        Brief
      </button>
      <button
        onClick={() => onLengthChange("detailed")}
        className={pill(length === "detailed")}
      >
        Detailed
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <button
        onClick={() => onBulletsChange(!bullets)}
        className={pill(bullets)}
      >
        Bullets
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <select
        value={lang}
        onChange={(e) => onLangChange(e.target.value)}
        className="px-3 py-1.5 rounded-lg text-sm bg-white/[0.03] text-white/50 border border-white/[0.06] outline-none cursor-pointer hover:bg-white/[0.06] transition-all"
      >
        <option value="" className="bg-[#1a1a2e]">
          Original language
        </option>
        {LANGUAGES.filter(Boolean).map((l) => (
          <option key={l} value={l} className="bg-[#1a1a2e]">
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
