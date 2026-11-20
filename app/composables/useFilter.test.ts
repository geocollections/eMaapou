import { wktToGeoJSON } from "@terraformer/wkt";
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
  range: {
    type: "range",
    value: [null, null],
    placeholders: ["range.min", "range.max"],
    fields: ["range"],
  } as RangeFilter,
  bool: {
    type: "boolean",
    value: false,
    fields: ["bool"],
  } as BooleanFilter,
};

describe("useFilter", () => {
  it("converts a drawn polygon into a valid spatial query", () => {
    const { solrFilters } = useFilters({
      geometry: {
        type: "geom",
        fields: ["latlong"],
        value: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [24, 58],
                [25, 58],
                [25, 59],
                [24, 59],
                [24, 58],
              ],
            ],
          },
        },
      } as GeomFilter,
    });
    expect(solrFilters.value).toHaveLength(1);
    const filter = String(solrFilters.value[0]);
    expect(filter).toMatch(/^latlong:"intersects\(/);
    const geometry = wktToGeoJSON(filter.slice("latlong:\"intersects(".length, -2));
    expect(geometry.type).toBe("MultiPolygon");
  });

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

  it("matches the selected taxon and its descendants", () => {
    const { filters, solrFilters } = useFilters({
      taxon: {
        type: "idList",
        value: [],
        fields: ["taxon_hierarchy_descendent_paths"],
        alphaNumeric: false,
        lookup: "startswith",
        tag: "taxon",
      } as StringIdListFilter,
    });

    filters.value.taxon.value = ["29-22224-"];

    expect(solrFilters.value).toStrictEqual([
      { "#taxon": "taxon_hierarchy_descendent_paths:29-22224-*" },
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

    filters.value.test.value = ["!*+-=<>&|()[]{}^~?:\\/"];

    expect(solrFilters.value).toStrictEqual([
      "test:\\!\\*\\+\\-\\=\\<\\>\\&\\|\\(\\)\\[\\]\\{\\}\\^\\~\\?\\:\\\\\\/",
    ]);
  });

  it("[text] escape spaces", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.test.value = ["value value value"];

    expect(solrFilters.value).toStrictEqual([
      "test:value\\ value\\ value",
    ]);
  });

  it("[range] sets min", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.range.value = [1, null];

    expect(solrFilters.value).toStrictEqual(["range:[1 TO *]"]);
  });

  it("[range] sets max", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.range.value = [null, 1];

    expect(solrFilters.value).toStrictEqual(["range:[* TO 1]"]);
  });

  it("[range] sets both", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.range.value = [1, 2];

    expect(solrFilters.value).toStrictEqual(["range:[1 TO 2]"]);
  });

  it("[boolean] sets true", () => {
    const { filters, solrFilters } = useFilters(initFilters);

    filters.value.bool.value = true;

    expect(solrFilters.value).toStrictEqual(["bool:true"]);
  });
});
