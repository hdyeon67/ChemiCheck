// 해석 문구 조립 — ChemiResult + 관계 유형 → ChemiReport
//   입력 시드로 각 섹션의 변형을 결정적으로 선택한다. 같은 입력이면 항상 같은 리포트.

import type { ChemiResult, RelationType } from "../scoring/types";
import { ohaengRelation } from "../scoring/ohaeng";
import type { BandIndex, ChemiReport } from "./types";
import { scoreToBand, BADGES } from "./bands";
import { pick } from "./select";
import { selectChemiType } from "./chemiTypes";
import { SUMMARIES } from "./summaries";
import { ANALYSIS_OPENERS, ANALYSIS_BODIES } from "./analyses";
import { CAUTIONS } from "./cautions";
import { BOOSTERS } from "./boosters";
import { personaOf } from "./personas";
import { reactionFor } from "./reactions";
import { CHEMI_ITEMS, CHEMI_COLORS, CHEMI_PLACES } from "./boosterExtras";

/** ChemiResult + 관계 유형으로 해석 리포트 조립 */
export function buildReport(
  result: ChemiResult,
  relation: RelationType,
): ChemiReport {
  const { score, seed, profileA, profileB } = result;
  const band: BandIndex = scoreToBand(score);
  const rel = ohaengRelation(profileA.ohaeng, profileB.ohaeng);

  const summary = pick(SUMMARIES[relation][band], seed, "summary");
  const opener = pick(ANALYSIS_OPENERS[rel], seed, "analysisOpener");
  const body = pick(ANALYSIS_BODIES[band], seed, "analysisBody");
  const analysis = `${opener} ${body}`;
  const caution = pick(CAUTIONS[band], seed, "caution");
  const booster = pick(BOOSTERS[relation][band], seed, "booster");

  return {
    band,
    badge: BADGES[band],
    chemiType: selectChemiType(rel, seed),
    summary,
    analysis,
    caution,
    booster,
    personaA: personaOf(profileA.ohaeng),
    personaB: personaOf(profileB.ohaeng),
    reaction: reactionFor(profileA.ohaeng, profileB.ohaeng),
    chemiItem: pick(CHEMI_ITEMS[relation], seed, "item"),
    chemiColor: pick(CHEMI_COLORS, seed, "color"),
    chemiPlace: pick(CHEMI_PLACES[relation], seed, "place"),
  };
}

// 재노출
export * from "./types";
export { scoreToBand, scoreToBadge, BADGES, BAND_RANGES } from "./bands";
export { ALL_CHEMI_TYPES, CHEMI_TYPES } from "./chemiTypes";
export { PERSONAS, personaOf, type Persona } from "./personas";
export { reactionFor, ALL_REACTIONS } from "./reactions";
export { CHEMI_ITEMS, CHEMI_COLORS, CHEMI_PLACES } from "./boosterExtras";
