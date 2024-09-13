// @vitest-environment nuxt
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import FilterInputHierarchy, { type TreeNode } from "~/components/filter/input/FilterInputHierarchy.vue";

const titleSelector = "[data-test=\"title\"]";

describe("filterInputHierarchy", () => {
  const vuetify = createVuetify({
    components,
    directives,
  });
  const i18n = createI18n({
  });
  enableAutoUnmount(afterEach);

  it("should render title", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <VExpansionPanels>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </VExpansionPanels>
        </Suspense>
`,
    }, {
      components: { FilterInputHierarchy },
      data() {
        return {
          title: "Title",
          modelValue: [],
          rootValue: "",
          hydrationFunction: async () => [],
          getChildren: async (): Promise<[TreeNode[], number]> => ([[], 0]),
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    await flushPromises();
    const title = wrapper.get(titleSelector);
    expect(title.text()).toBe("Title");
  });

  it("should show hierarchy root", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <VExpansionPanels>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </VExpansionPanels>
        </Suspense>
`,
    }, {
      components: { FilterInputHierarchy },
      data() {
        return {
          title: "Title",
          modelValue: [],
          rootValue: "",
          hydrationFunction: async () => [],
          getChildren: async (): Promise<[TreeNode[], number]> => ([[{
            id: 1,
            name: "item1",
            leaf: true,
            children: [],
            childrenLoaded: false,
            showChildren: false,
            count: 0,
            value: "item1",
          }], 1]),
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await nextTick();

    const treeItem = wrapper.get("[data-test=\"tree-item\"]");

    expect(treeItem.isVisible()).toBe(true);
    expect(treeItem.text()).toBe("item1 (0)");
  });

  it("should show children when parent clicked", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <VExpansionPanels>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </VExpansionPanels>
        </Suspense>`,
    }, {
      components: { FilterInputHierarchy },
      data() {
        return {
          title: "Title",
          modelValue: [],
          rootValue: "",
          hydrationFunction: async () => [],
          getChildren: async (): Promise<[TreeNode[], number]> => ([[{
            id: 1,
            name: "item1",
            leaf: false,
            children: [],
            childrenLoaded: false,
            showChildren: false,
            count: 0,
            value: "item1",
          }], 1]),
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await nextTick();

    const rootTreeItem = wrapper.get("[data-test=\"tree-item\"]");
    await rootTreeItem.get("[data-test=\"show-children\"]").trigger("click");

    const children = rootTreeItem.findAll("[data-test=\"tree-item\"]");
    expect(children).toHaveLength(1);

    const child = children[0]!;
    await child.get("[data-test=\"show-children\"]").trigger("click");

    const grandChildren = child.findAll("[data-test=\"tree-item\"]");
    expect(grandChildren).toHaveLength(1);
  });

  it("should show more children when show more is clicked", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <VExpansionPanels>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </VExpansionPanels>
        </Suspense>`,
    }, {
      components: { FilterInputHierarchy },
      data() {
        return {
          title: "Title",
          modelValue: [],
          rootValue: "",
          hydrationFunction: async () => [],
          getChildren: async (): Promise<[TreeNode[], number]> => {
            const child = {
              id: 1,
              name: "item1",
              leaf: false,
              children: [],
              childrenLoaded: false,
              showChildren: false,
              count: 0,
              value: "item1",
            };
            return [Array.from({ length: 10 }, _e => ({ ...child })), 20];
          },
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await nextTick();

    const rootTreeItem = wrapper.get("[data-test=\"tree-item\"]");
    await rootTreeItem.get("[data-test=\"show-children\"]").trigger("click");

    const children = wrapper.findAll("[data-test=\"tree-item\"]");

    const child = children[0]!;
    await child.get("[data-test=\"show-more\"]").trigger("click");

    const grandChildren = child.findAll("[data-test=\"tree-item\"]");
    expect(grandChildren).toHaveLength(20);
  });

  it("should hide \"show more\" button when ran out of children", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <VExpansionPanels>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </VExpansionPanels>
        </Suspense>`,
    }, {
      components: { FilterInputHierarchy },
      data() {
        return {
          title: "Title",
          modelValue: [],
          rootValue: "",
          hydrationFunction: async () => [],
          getChildren: async (): Promise<[TreeNode[], number]> => {
            const child = {
              id: 1,
              name: "item1",
              leaf: false,
              children: [],
              childrenLoaded: false,
              showChildren: false,
              count: 0,
              value: "item1",
            };
            return [Array.from({ length: 10 }, _e => ({ ...child })), 20];
          },
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await nextTick();

    const rootTreeItem = wrapper.get("[data-test=\"tree-item\"]");
    await rootTreeItem.get("[data-test=\"show-children\"]").trigger("click");
    const showMoreButton = rootTreeItem.get("[data-test=\"show-more\"]");
    await showMoreButton.trigger("click");

    expect(rootTreeItem.find("[data-test=\"show-more\"]").exists()).toBe(false);
  });
});
