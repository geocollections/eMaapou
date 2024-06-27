// @vitest-environment nuxt
import { afterEach, describe, expect, it } from "vitest";
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { createI18n } from "vue-i18n";
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

    const rootTreeItem = wrapper.get("[data-test=\"tree-item\"]");
    await rootTreeItem.get("[data-test=\"show-children\"]").trigger("click");

    const children = rootTreeItem.findAll("[data-test=\"tree-item\"]");
    expect(children).toHaveLength(1);

    const child = children[0]!;
    await child.get("[data-test=\"show-children\"]").trigger("click");

    const grandChildren = child.findAll("[data-test=\"tree-item\"]");
    expect(grandChildren).toHaveLength(1);
  });
});
