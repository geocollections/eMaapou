import { describe, expect, it } from "vitest";

const initFilters = {
  test: {
    type: "textList",
    value: [],
    fields: ["test"],
  } as TextListFilter,
  foo: {
    type: "idList",
    value: [],
    fields: ["foo"],
    tag: "foo",
  } as IdListFilter,
};

describe("useFilter", () => {
  it("sets value", () => {
    const { filters } = useFilters(initFilters);

    filters.value.test.value = ["test"];

    expect(filters.value.test.value).toStrictEqual(["test"]);
  });

  it("resets value", () => {
    const { filters, reset } = useFilters(initFilters);

    filters.value.test.value = ["test"];

    reset();

    expect(filters.value.test.value).toStrictEqual([]);
  });

  it("returns solrFilters", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.test.value = ["test"];
    filters.value.foo.value = ["1"];

    expect(solrFilters.value).toStrictEqual([
      "test:test",
      { "#foo": "foo:1" },
    ]);
  });

  it("resets solrFilters", () => {
    const { filters, solrFilters, reset } = useFilters(initFilters);

    filters.value.test.value = ["test"];
    filters.value.foo.value = ["foo"];

    reset();

    expect(solrFilters.value).toStrictEqual([]);
  });

  it("[text] escape special characters", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.test.value = ["value:value"];

    expect(solrFilters.value).toStrictEqual([
      "test:value\\:value",
    ]);
  });

  it("[text] escape spaces", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.test.value = ["value value value"];

    expect(solrFilters.value).toStrictEqual([
      "test:value\\ value\\ value",
    ]);
  });
});
