import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import FilterInputRange from "./FilterInputRange.vue";

describe("range validation", () => {
  it("preserves invalid values without applying them and accepts a corrected range", async () => {
    const wrapper = await mountSuspended(FilterInputRange, {
      props: {
        title: "Depth",
        modelValue: [100, null],
      },
    });
    await wrapper.get("[data-test=title]").trigger("click");
    const inputs = wrapper.findAll("input");
    await inputs[1]!.setValue("10");
    await inputs[1]!.trigger("blur");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect((inputs[0]!.element as HTMLInputElement).value).toBe("100");
    expect((inputs[1]!.element as HTMLInputElement).value).toBe("10");
    expect(wrapper.get("[role=alert]").text()).toBe("Miinimum ei tohi olla maksimumist suurem.");
    await inputs[1]!.setValue("200");
    await inputs[1]!.trigger("blur");
    expect(wrapper.find("[role=alert]").exists()).toBe(false);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
      [100, 200],
    ]);
    wrapper.unmount();
  });
});
