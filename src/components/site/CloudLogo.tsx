/**
 * Cloud provider logos, used wherever a page says Onam connects to a provider.
 * Files: public/logos/cloud/*.svg (each provider's own logo, unmodified; sources and terms in
 * public/logos/cloud/NOTICE.md). On trial: the owner reviews the look and keeps, replaces or removes them.
 *
 * Wordmarks (AWS, Google Cloud, Oracle, Alibaba Cloud, IBM) already carry the name, so the name is
 * only screen-reader text. Symbol-only marks (Azure, Kubernetes) show the name beside the symbol.
 */
type Logo = { file: string; label: string; wordmark: boolean; /** visual width relative to height */ ratio: number };

const LOGOS: Record<string, Logo> = {
  aws: { file: "aws.svg", label: "AWS", wordmark: true, ratio: 1.67 },
  azure: { file: "azure.svg", label: "Microsoft Azure", wordmark: false, ratio: 1 },
  gcp: { file: "gcp.svg", label: "Google Cloud", wordmark: true, ratio: 6.46 },
  oci: { file: "oci.svg", label: "Oracle Cloud", wordmark: true, ratio: 7.7 },
  alibaba: { file: "alibaba.svg", label: "Alibaba Cloud", wordmark: true, ratio: 7.94 },
  ibm: { file: "ibm.svg", label: "IBM Cloud", wordmark: true, ratio: 2.68 },
  kubernetes: { file: "kubernetes.svg", label: "Kubernetes", wordmark: false, ratio: 1.03 },
};

const ALIASES: Record<string, keyof typeof LOGOS> = {
  aws: "aws",
  "amazon web services": "aws",
  azure: "azure",
  "microsoft azure": "azure",
  "google cloud": "gcp",
  gcp: "gcp",
  "oracle cloud": "oci",
  "oracle cloud (oci)": "oci",
  oci: "oci",
  "alibaba cloud": "alibaba",
  "ibm cloud": "ibm",
  kubernetes: "kubernetes",
};

export function cloudLogoKey(name: string): keyof typeof LOGOS | undefined {
  return ALIASES[name.trim().toLowerCase()];
}

/**
 * `height` is the logo's rendered height in px. Wide wordmarks are capped in width so a row of
 * logos reads evenly; `showName` forces the text label (e.g. "IBM" logo + "IBM Cloud").
 */
export function CloudLogo({
  name,
  height = 24,
  maxWidth = 120,
  showName,
  className = "",
  stack = false,
  nameClassName = "text-[14px] font-semibold text-ink-2",
}: {
  /** Name under the logo instead of beside it (narrow tiles). */
  stack?: boolean;
  name: string;
  height?: number;
  maxWidth?: number;
  showName?: boolean;
  className?: string;
  nameClassName?: string;
}) {
  const key = cloudLogoKey(name);
  if (!key) return <span className={nameClassName}>{name}</span>;
  const l = LOGOS[key];
  // Keep wide wordmarks legible: scale height down only as far as the width cap needs.
  const h = Math.min(height, maxWidth / l.ratio);
  const label = key === "ibm" ? "IBM Cloud" : l.label;
  const withName = showName ?? (!l.wordmark || key === "ibm");
  return (
    <span className={`inline-flex items-center ${stack ? "flex-col gap-1" : "gap-2"} ${className}`}>
      <img
        src={`/logos/cloud/${l.file}`}
        alt={withName ? "" : label}
        height={Math.round(h)}
        width={Math.round(h * l.ratio)}
        style={{ height: h, width: "auto" }}
        loading="lazy"
        decoding="async"
      />
      {withName && <span className={nameClassName}>{label}</span>}
    </span>
  );
}
