import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import PortalPagination from "./PortalPagination.vue";

describe("compact pagination", () => {
  it("navigates large record lists without a page-size selector", async () => {
    const options = { page: 1, itemsPerPage: 25, sortBy: [] };
    const wrapper = await mountSuspended(PortalPagination, {
      props: { compact: true, options, count: 8756 },
    });
    expect(wrapper.find("[role=\"combobox\"]").exists()).toBe(false);
    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]!.attributes("disabled")).toBeDefined();
    await buttons[1]!.trigger("click");
    expect(wrapper.emitted("update")?.at(-1)).toEqual([
      { ...options, page: 2 },
    ]);
    const input = wrapper.get("input[type=\"number\"]");
    await input.setValue(4);
    await input.trigger("change");
    expect(wrapper.emitted("update")?.at(-1)).toEqual([
      { ...options, page: 4 },
    ]);
    wrapper.unmount();
  });
});
