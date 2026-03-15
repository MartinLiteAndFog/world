import type { BusinessEntity } from "@street-stocks/domain";

import type { NormalizedBusinessRecord } from "../normalize/normalize-business.js";

export function matchBusinessRecord(
  record: NormalizedBusinessRecord,
  candidates: BusinessEntity[]
): BusinessEntity | undefined {
  return candidates.find((candidate) => {
    return (
      candidate.canonicalName.trim().toLowerCase() ===
        record.business.canonicalName.trim().toLowerCase() && candidate.id === record.business.id
    );
  });
}
