import type { BusinessListItem, CountrySummary } from "./api";

export type CategoryScope = "global" | "country" | "viewport";

type CategoryScopeInput = {
  scope: CategoryScope;
  businesses: BusinessListItem[];
  countrySummaries: CountrySummary[];
  selectedCountryCode: string | null;
};

export function deriveCategoryScopeCounts({
  scope,
  businesses,
  countrySummaries,
  selectedCountryCode,
}: CategoryScopeInput): Map<string, number> {
  if (scope === "viewport") {
    return countBusinessCategories(businesses);
  }

  if (scope === "country") {
    const selected = countrySummaries.find(
      (summary) => summary.countryCode === selectedCountryCode
    );
    return selected ? mapCategoryCounts(selected.categoryCounts) : new Map();
  }

  const counts = new Map<string, number>();
  for (const summary of countrySummaries) {
    for (const [category, count] of Object.entries(summary.categoryCounts)) {
      counts.set(category, (counts.get(category) ?? 0) + count);
    }
  }
  return counts;
}

function countBusinessCategories(businesses: BusinessListItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const business of businesses) {
    const category = business.category ?? "unknown";
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return counts;
}

function mapCategoryCounts(categoryCounts: Record<string, number>): Map<string, number> {
  return new Map(Object.entries(categoryCounts));
}
