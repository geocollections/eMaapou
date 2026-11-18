import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import FilterInputText from "~/components/filter/input/FilterInputText.vue";

const titleSelector = "[data-test=\"title\"]";

describe("filterInputText", () => {
  const i18n = createI18n({
  });
  enableAutoUnmount(afterEach);

  it("does not focus an input after its filter is unmounted", async () => {
    const errors: unknown[] = [];
    const wrapper = mount({
      template: "<div><FilterInputText title=\"Number\" :model-value=\"[]\" /></div>",
      components: { FilterInputText },
    }, {
      global: {
        plugins: [i18n],
        config: {
          errorHandler: error => errors.push(error),
        },
      },
    });
    wrapper.get(titleSelector).element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    wrapper.unmount();
    await nextTick();
    expect(errors).toEqual([]);
  });

  it("should render title", () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      data() {
        return {
          title: "Title",
          modelValue: [],
        };
      },
      components: { FilterInputText },
      global: {
        plugins: [i18n],
      },
    });
    const title = wrapper.get(titleSelector);
    expect(title.text()).toBe("Title");
  });

  it("should show selected items when opened", async () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      components: { FilterInputText },
      data() {
        return {
          title: "Title",
          modelValue: ["item1", "item2"],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.get(titleSelector).trigger("click");
    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItemsText = selectedItems.map(item => item.text());
    expect(selectedItemsText).toEqual(["item1", "item2"]);
  });

  it("should remove selected item when checkbox clicked", async () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      components: { FilterInputText },
      data() {
        return {
          title: "Title",
          modelValue: ["item1", "item2"],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.get(titleSelector).trigger("click");
    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    expect(selectedItems).toHaveLength(2);

    const checkbox = selectedItems[0]!.find("[role=\"checkbox\"]");
    await checkbox.trigger("click");

    const selectedItemsAfter = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItemsText = selectedItemsAfter.map(item => item.text());
    expect(selectedItemsText).toEqual(["item2"]);
  });

  it("should open panel when selected item clicked and fill input", async () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      attachTo: document.body,
      components: { FilterInputText },
      data() {
        return {
          title: "Title",
          modelValue: ["item1", "item2"],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.get(titleSelector).trigger("click");
    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItem = selectedItems[0]!;
    await selectedItem.trigger("click");
    await flushPromises();

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.element.matches("input")
      ? inputWrapper
      : inputWrapper.find("input");
    expect(input.element).toBe(document.activeElement);
    expect((input.element as HTMLInputElement).value).toBe("item1");
  });

  it("should add new value when input entered and enter pressed", async () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      components: { FilterInputText },
      data() {
        return {
          title: "Title",
          modelValue: ["item1", "item2"],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find(titleSelector).trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.element.matches("input")
      ? inputWrapper
      : inputWrapper.find("input");
    await input.setValue("item3");
    await input.trigger("keydown.enter");

    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItemsText = selectedItems.map(item => item.text());
    expect(selectedItemsText).toEqual(["item1", "item2", "item3"]);
  });

  it("should add new value when input entered and add button pressed", async () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      components: { FilterInputText },
      data() {
        return {
          title: "Title",
          modelValue: ["item1", "item2"],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find(titleSelector).trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.element.matches("input")
      ? inputWrapper
      : inputWrapper.find("input");
    await input.setValue("item3");
    await wrapper.find("[data-test=\"add-button\"]").trigger("click");

    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItemsText = selectedItems.map(item => item.text());
    expect(selectedItemsText).toEqual(["item1", "item2", "item3"]);
  });

  it("should trim input value when adding new value", async () => {
    const wrapper = mount({
      template: "<div><FilterInputText :title=\"title\" v-model=\"modelValue\"/></div>",
    }, {
      components: { FilterInputText },
      data() {
        return {
          title: "Title",
          modelValue: ["item1", "item2"],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find(titleSelector).trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.element.matches("input")
      ? inputWrapper
      : inputWrapper.find("input");
    await input.setValue(" item3 ");
    await wrapper.find("[data-test=\"add-button\"]").trigger("click");

    expect(wrapper.findComponent(FilterInputText).props("modelValue")).toEqual(["item1", "item2", "item3"]);

    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItemsText = selectedItems.map(item => item.text());
    expect(selectedItemsText).toEqual(["item1", "item2", "item3"]);
  });
});
