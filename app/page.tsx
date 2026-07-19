import { BentoHome } from "@/components/bento-home";
import { DEMO_CONFIG } from "@/data/config";
import { loadMtsp, loadSynthetic } from "@/lib/corpus/loader";

export default function Home() {
  const docs = loadSynthetic();
  const mtsp = loadMtsp();
  const hh4Limit = mtsp.get(DEMO_CONFIG.geography, 4, DEMO_CONFIG.amiThreshold);
  if (hh4Limit == null) {
    throw new Error(
      `Missing MTSP limit for HH4 @ ${DEMO_CONFIG.amiThreshold}% in ${DEMO_CONFIG.geography}`,
    );
  }

  return (
    <BentoHome
      metro={DEMO_CONFIG.metro}
      program={DEMO_CONFIG.program}
      ruleYear={DEMO_CONFIG.ruleYear}
      effectiveDate={DEMO_CONFIG.effectiveDate}
      geography={DEMO_CONFIG.geography}
      amiThreshold={DEMO_CONFIG.amiThreshold}
      hh4Limit={hh4Limit}
      docs={docs.map((d) => ({ id: d.id, type: d.type }))}
    />
  );
}
