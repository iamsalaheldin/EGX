import React from "react";
import { DataStatus } from "../../server/types.js";
import { Language, translations } from "../translations.js";

interface StatusBadgeProps {
  status: DataStatus;
  lang: Language;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang }) => {
  const t = translations[lang];

  switch (status) {
    case "live":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{t.statusLive}</span>
        </span>
      );
    case "delayed":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{t.statusDelayed}</span>
        </span>
      );
    case "estimated":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span>{t.statusEstimated}</span>
        </span>
      );
    case "stale":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span>{t.statusStale}</span>
        </span>
      );
    case "unavailable":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>{t.statusUnavailable}</span>
        </span>
      );
  }
};
