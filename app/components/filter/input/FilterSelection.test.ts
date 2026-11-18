import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import FilterInputAutocomplete from "./FilterInputAutocomplete.vue";
import FilterInputHierarchy from "./FilterInputHierarchy.vue";

const estonia = { id: "ee", name: "Estonia", count: 12 };
const finland = { id: "fi", name: "Finland", count: 5 };

describe("filter selections", () => {
  it("shows each choice once and keeps selections when collapsed", async () => {
    const wrapper = await mountSuspended(FilterInputAutocomplete, {
      props: {
        title: "Country",
        modelValue: ["ee"],
        hydrationFunction: async () => [estonia],
        queryFunction: async () => [estonia, finland],
      },
    });
    const choices = (label: string) => wrapper.findAll(`[role="checkbox"][aria-label="${label}"]`);
    expect(choices("Estonia")).toHaveLength(0);
    expect(wrapper.get(".portal-filter-count").text()).toBe("1");
    await wrapper.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    expect(choices("Estonia")).toHaveLength(1);
    expect(choices("Estonia")[0]!.attributes("aria-checked")).toBe("true");
    await choices("Finland")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
      ["ee", "fi"],
    ]);
    expect(choices("Finland")).toHaveLength(1);
    await wrapper.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    expect(choices("Estonia")).toHaveLength(0);
    expect(choices("Finland")).toHaveLength(0);
    expect(wrapper.get("[data-test=\"title\"]").attributes("aria-expanded")).toBe("false");
    await wrapper.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    await choices("Estonia")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
      ["fi"],
    ]);
    wrapper.unmount();
  });

  it("shows a selected hierarchy node once when its tree is visible", async () => {
    const node = {
      id: 1,
      name: "Rock",
      value: "1",
      count: 12,
      leaf: true,
      children: [],
      childrenLoaded: true,
      showChildren: false,
    };
    const wrapper = await mountSuspended(FilterInputHierarchy, {
      props: {
        title: "Rock type",
        modelValue: ["1"],
        rootValue: "",
        hydrationFunction: async () => [node],
        getChildren: async () => [
          [node],
          1,
        ],
        suggestionFunction: async () => [],
      },
    });
    expect(wrapper.findAll("[role=\"checkbox\"]")).toHaveLength(0);
    await wrapper.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    expect(wrapper.findAll("[role=\"checkbox\"]")).toHaveLength(1);
    expect(wrapper.get("[role=\"checkbox\"]").attributes("aria-checked")).toBe("true");
    await wrapper.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    expect(wrapper.findAll("[role=\"checkbox\"]")).toHaveLength(0);
    wrapper.unmount();
  });
  it("updates individual selections when removed outside the filter", async () => {
    const country = await mountSuspended(FilterInputAutocomplete, {
      props: {
        title: "Country",
        modelValue: ["ee", "fi"],
        hydrationFunction: async values => [estonia, finland].filter(item => values.includes(item.id)),
        queryFunction: async () => [estonia, finland],
      },
    });
    await country.setProps({
      modelValue: ["fi"],
    });
    await flushPromises();
    expect(country.findAll("[role=\"checkbox\"][aria-label=\"Estonia\"]")).toHaveLength(0);
    expect(country.get(".portal-filter-count").text()).toBe("1");
    await country.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    expect(country.emitted("update:modelValue")).toBeUndefined();
    country.unmount();

    const nodes = ["1-110", "1-109"].map((value, index) => ({
      id: index,
      name: `Stage ${index}`,
      value,
      count: 12,
      leaf: true,
      children: [],
      childrenLoaded: true,
      showChildren: false,
    }));
    const stratigraphy = await mountSuspended(FilterInputHierarchy, {
      props: {
        title: "Stratigraphy",
        modelValue: ["1-110", "1-109"],
        rootValue: "",
        hydrationFunction: async values => nodes.filter(item => values.includes(item.value)),
        getChildren: async () => [nodes, 2],
        suggestionFunction: async () => [],
      },
    });
    await stratigraphy.setProps({
      modelValue: ["1-109"],
    });
    await flushPromises();
    expect(stratigraphy.get(".portal-filter-count").text()).toBe("1");
    await stratigraphy.get("[data-test=\"title\"]").trigger("click");
    await flushPromises();
    expect(stratigraphy.text()).toContain("Stage 1");
    expect(stratigraphy.emitted("update:modelValue")).toBeUndefined();
    stratigraphy.unmount();
  });
});
