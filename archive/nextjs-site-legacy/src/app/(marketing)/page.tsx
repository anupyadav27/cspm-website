import { Hero }            from '@/components/home/Hero'
import { OutcomeStrip }    from '@/components/home/OutcomeStrip'
import { CloudProviderBar } from '@/components/home/CloudProviderBar'
import { HowItWorks }       from '@/components/home/HowItWorks'
import { ProductDemo }      from '@/components/home/ProductDemo'
import { DemoVideo }        from '@/components/home/DemoVideo'
import { PlatformPillars }  from '@/components/home/PlatformPillars'
import { Testimonials }     from '@/components/home/Testimonials'
import { StatsSection }     from '@/components/home/StatsSection'
import { ComplianceSection } from '@/components/home/ComplianceSection'
import { WhyNow }           from '@/components/home/WhyNow'
import { Differentiator }   from '@/components/home/Differentiator'
import { TrustBar }         from '@/components/home/TrustBar'
import { CtaBanner }        from '@/components/home/CtaBanner'

export default function HomePage() {
  return (
    <>
      {/* 1. Problem statement + CTA */}
      <Hero />

      {/* 2. Specific outcome metrics — what teams actually find */}
      <OutcomeStrip />

      {/* 3. Proof: we support every cloud you run */}
      <CloudProviderBar />

      {/* 4. How it works — 3-step process */}
      <HowItWorks />

      {/* 5. See it in action — tabbed real product screenshots */}
      <ProductDemo />

      {/* 6. Live scan demo video */}
      <DemoVideo />

      {/* 7. What we cover — 16+ domains grouped by cluster */}
      <PlatformPillars />

      {/* 8. Social proof — what teams find after their first scan */}
      <Testimonials />

      {/* 9. Outcome-focused proof metrics */}
      <StatsSection />

      {/* 10. Compliance — ready for your next audit */}
      <ComplianceSection />

      {/* 11. Why this problem is urgent right now */}
      <WhyNow />

      {/* 12. Why Onam vs. native tools / point solutions / manual audits */}
      <Differentiator />

      {/* 13. Trust signals — SOC 2, ISO 27001, frameworks covered */}
      <TrustBar />

      {/* 14. Final CTA */}
      <CtaBanner />
    </>
  )
}
