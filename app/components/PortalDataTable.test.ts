import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
import PortalDataTable from "./PortalDataTable.vue";

const { navigate } = vi.hoisted(() => ({
  navigate: vi.fn(),
}));
mockNuxtImport("navigateTo", () => navigate);

beforeEach(() => navigate.mockClear());

async function mountTable() {
  return mountSuspended(PortalDataTable, {
    props: {
      modern: true,
      onlyTable: true,
      items: [
        { id: 42, locality: "Aluvere", image: "photo" },
      ],
      headers: ["id", "locality", "image"].map(value => ({ title: value, value, show: true })),
      options: { page: 1, itemsPerPage: 25, sortBy: [] },
      count: 1,
      isLoading: false,
      itemTo: item => `/specimen/${item.id}`,
    },
    global: {
      stubs: {
        UTooltip: { template: "<slot />" },
      },
    },
    slots: {
      "item.locality": () => h("a", {
        href: "/locality/7",
        onClick: (event: Event) => event.preventDefault(),
      }, "Aluvere"),
      "item.image": () => h("button", { type: "button" }, "Photos"),
    },
  });
}

describe("record table navigation", () => {
  it("opens record details from a row without an extra action column", async () => {
    const wrapper = await mountTable();
    await wrapper.get("tbody td").trigger("click");
    expect(navigate).toHaveBeenCalledWith("/specimen/42", { external: false });
    expect(wrapper.emitted("click:row")).toEqual([
      [
        { index: 0, id: "42" },
      ],
    ]);
    expect(wrapper.find(".portal-table-record-action").exists()).toBe(false);
    expect(wrapper.findAll("thead th")).toHaveLength(3);
    wrapper.unmount();
  });

  it("keeps related links and photograph buttons independent of row navigation", async () => {
    const wrapper = await mountTable();
    await wrapper.get("tbody a[href='/locality/7']").trigger("click");
    await wrapper.get("tbody button").trigger("click");
    expect(navigate).not.toHaveBeenCalled();
    expect(wrapper.emitted("click:row")).toBeUndefined();
    wrapper.unmount();
  });

  it("opens the focused row using the keyboard", async () => {
    const wrapper = await mountTable();
    const row = wrapper.get("tbody tr");
    expect(row.attributes("tabindex")).toBe("0");
    await row.trigger("keydown", { key: "Enter" });
    expect(navigate).toHaveBeenCalledWith("/specimen/42", { external: false });
    wrapper.unmount();
  });
});
