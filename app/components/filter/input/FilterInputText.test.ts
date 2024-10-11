// @vitest-environment nuxt
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import FilterInputText from "~/components/filter/input/FilterInputText.vue";

const titleSelector = "[data-test=\"title\"]";

describe("filterInputText", () => {
  const vuetify = createVuetify({
    components,
    directives,
  });
  const i18n = createI18n({
  });
  enableAutoUnmount(afterEach);

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
        plugins: [vuetify, i18n],
      },
    });
    const title = wrapper.get(titleSelector);
    expect(title.text()).toBe("Title");
  });

  it("should show selected items", () => {
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
        plugins: [vuetify, i18n],
      },
    });

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
        plugins: [vuetify, i18n],
      },
    });

    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    expect(selectedItems).toHaveLength(2);

    const checkbox = selectedItems[0]!.find("input[type=\"checkbox\"]");
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
        plugins: [vuetify, i18n],
      },
    });

    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItem = selectedItems[0]!;
    await selectedItem.trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.find("input");
    expect(input.element).toBe(document.activeElement);
    expect(input.element.value).toBe("item1");
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
        plugins: [vuetify, i18n],
      },
    });

    await wrapper.find(titleSelector).trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.find("input");
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
        plugins: [vuetify, i18n],
      },
    });

    await wrapper.find(titleSelector).trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.find("input");
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
        plugins: [vuetify, i18n],
      },
    });

    await wrapper.find(titleSelector).trigger("click");

    const inputWrapper = wrapper.get("[data-test=\"text-input\"]");
    const input = inputWrapper.find("input");
    await input.setValue(" item3 ");
    await wrapper.find("[data-test=\"add-button\"]").trigger("click");

    expect(wrapper.findComponent(FilterInputText).props("modelValue")).toEqual(["item1", "item2", "item3"]);

    const selectedItems = wrapper.findAll("[data-test=\"selected-item\"]");
    const selectedItemsText = selectedItems.map(item => item.text());
    expect(selectedItemsText).toEqual(["item1", "item2", "item3"]);
  });
});
