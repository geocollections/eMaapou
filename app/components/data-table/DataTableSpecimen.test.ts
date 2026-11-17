import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import DataTableSpecimen from "./DataTableSpecimen.vue";

const TableStub = defineComponent({
  name: "PortalDataTable",
  props: ["showSearch", "dynamicHeaders"],
  emits: ["update", "change:headers"],
  template: "<div />",
});

describe("specimen table wrapper", () => {
  it("forwards table updates and column changes alongside the photo viewer", async () => {
    const update = vi.fn();
    const changeHeaders = vi.fn();
    const options = { page: 1, itemsPerPage: 25, sortBy: [] };
    const wrapper = await mountSuspended(DataTableSpecimen, {
      props: {
        items: [],
        headers: [],
        count: 0,
        options,
        isLoading: false,
      },
      attrs: { "onUpdate": update, "onChange:headers": changeHeaders },
      global: {
        stubs: { PortalDataTable: TableStub },
      },
    });
    const table = wrapper.findComponent(TableStub);
    expect(table.props()).toMatchObject({ showSearch: true, dynamicHeaders: true });
    const payload = {
      options: { ...options, page: 2 },
      search: "",
    };
    table.vm.$emit("update", payload);
    table.vm.$emit("change:headers", "id");
    expect(update).toHaveBeenCalledWith(payload);
    expect(changeHeaders).toHaveBeenCalledWith("id");
    wrapper.unmount();
  });
});
