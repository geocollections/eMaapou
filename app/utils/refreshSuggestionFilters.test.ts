import { describe, expect, it, vi } from "vitest";

describe("refreshSuggestionFilters", () => {
  it("refreshes all filters", () => {
    const suggestionRefreshMap = {
      a: vi.fn(),
      b: vi.fn(),
      c: vi.fn(),
    };
    const excludeKey = undefined;
    refreshSuggestionFilters(suggestionRefreshMap, excludeKey);
    expect(suggestionRefreshMap.a).toHaveBeenCalledTimes(1);
    expect(suggestionRefreshMap.b).toHaveBeenCalledTimes(1);
    expect(suggestionRefreshMap.c).toHaveBeenCalledTimes(1);
  });

  it("excludes filter", () => {
    const suggestionRefreshMap = {
      a: vi.fn(),
      b: vi.fn(),
      c: vi.fn(),
    };
    const excludeKey = "b";
    refreshSuggestionFilters(suggestionRefreshMap, excludeKey);
    expect(suggestionRefreshMap.a).toHaveBeenCalledTimes(1);
    expect(suggestionRefreshMap.b).not.toHaveBeenCalled();
    expect(suggestionRefreshMap.c).toHaveBeenCalledTimes(1);
  });

  it("excluded filter does not exist", () => {
    const suggestionRefreshMap = {
      a: vi.fn(),
      b: vi.fn(),
      c: vi.fn(),
    };
    const excludeKey = "d";
    // @ts-expect-error this test is to check that the function works even if excludeKey is not a key of suggestionRefreshMap
    refreshSuggestionFilters(suggestionRefreshMap, excludeKey);
    expect(suggestionRefreshMap.a).toHaveBeenCalledTimes(1);
    expect(suggestionRefreshMap.b).toHaveBeenCalledTimes(1);
    expect(suggestionRefreshMap.c).toHaveBeenCalledTimes(1);
  });
});
