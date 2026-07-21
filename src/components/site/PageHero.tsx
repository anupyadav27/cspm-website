import { BrandButton } from "./BrandButton";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  gradientWords,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  gradientWords?: string;
}) {
  const renderTitle = () => {
    if (!gradientWords) return title;
    const parts = title.split(gradientWords);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{gradientWords}</span>
        {parts[1]}
      </>
    );
  };
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#E5E9F0]">
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="absolute -top-40 right-0 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-6 bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display font-black text-[#0B1220] text-5xl md:text-6xl tracking-tight max-w-4xl mx-auto leading-[1.05]">
          {renderTitle()}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <BrandButton to="/request-demo" size="lg">Request demo →</BrandButton>
          <BrandButton to="/platform/cspm" size="lg" variant="secondary">Explore platform</BrandButton>
        </div>
      </div>
    </section>
  );
}

export function StubPage({
  eyebrow,
  title,
  subtitle,
  gradientWords,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  gradientWords?: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} gradientWords={gradientWords} />
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="bg-white border border-[#E5E9F0] rounded-3xl p-10 text-center shadow-[0_1px_3px_rgba(16,24,40,.06)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-[#E7F6EF] text-[#05A052] border border-[#BFE8D2]">
            Coming soon
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#0B1220]">
            Full page detail is on the way
          </h2>
          <p className="text-[#475569] mt-3 max-w-xl mx-auto">
            We're polishing this page. In the meantime, request a demo to see this
            capability live in Onam.
          </p>
          <div className="mt-6">
            <BrandButton to="/request-demo">Request demo</BrandButton>
          </div>
        </div>
      </section>
    </>
  );
}
