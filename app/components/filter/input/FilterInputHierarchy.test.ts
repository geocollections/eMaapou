import type { TreeNode } from "~/components/filter/input/FilterInputHierarchy.vue";
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { createI18n } from "vue-i18n";
import FilterInputHierarchy from "~/components/filter/input/FilterInputHierarchy.vue";
import en from "~/i18n/en.json";
import et from "~/i18n/et.json";

const titleSelector = "[data-test=\"title\"]";

describe("filterInputHierarchy", () => {
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    messages: { en, et },
  });
  enableAutoUnmount(afterEach);

  it("should render title", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <div>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </div>
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
        plugins: [i18n],
      },
    });

    await flushPromises();
    const title = wrapper.get(titleSelector);
    expect(title.text()).toBe("Title");
  });

  it("should open and load the hierarchy when defaultOpen is enabled", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
          <FilterInputHierarchy
            v-model="modelValue"
            :title="title"
            :root-value="rootValue"
            :default-open="true"
            :hydration-function="hydrationFunction"
            :get-children="getChildren"
            :suggestion-function="suggestionFunction"
          />
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
          getChildren: async (): Promise<[TreeNode[], number]> => ([
            [
              {
                id: 1,
                name: "item1",
                leaf: true,
                children: [],
                childrenLoaded: false,
                showChildren: false,
                count: 1,
                value: "item1",
              },
            ],
            1,
          ]),
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();

    expect(wrapper.get("[data-test=\"tree-item\"]").text()).toContain("item1");
  });

  it("should show a loading state before reporting an empty hierarchy", async () => {
    let resolveChildren!: (value: [TreeNode[], number]) => void;
    const childrenPromise = new Promise<[TreeNode[], number]>((resolve) => {
      resolveChildren = resolve;
    });
    const wrapper = mount({
      template: `
        <Suspense>
          <FilterInputHierarchy
            v-model="modelValue"
            :title="title"
            :root-value="rootValue"
            :default-open="true"
            :hydration-function="hydrationFunction"
            :get-children="getChildren"
            :suggestion-function="suggestionFunction"
          />
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
          getChildren: () => childrenPromise,
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();
    expect(wrapper.text()).toContain("Loading hierarchy...");
    expect(wrapper.text()).not.toContain("No options available");

    resolveChildren([[], 0]);
    await flushPromises();

    expect(wrapper.text()).toContain("No options available");
  });

  it("should show hierarchy root", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <div>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </div>
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
          getChildren: async (): Promise<[TreeNode[], number]> => ([
            [
              {
                id: 1,
                name: "item1",
                leaf: true,
                children: [],
                childrenLoaded: false,
                showChildren: false,
                count: 0,
                value: "item1",
              },
            ],
            1,
          ]),
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await flushPromises();

    const treeItem = wrapper.get("[data-test=\"tree-item\"]");

    expect(treeItem.isVisible()).toBe(true);
    expect(treeItem.text()).toBe("item1 (0)");
  });

  it("should show children when parent clicked", async () => {
    const wrapper = mount({
      template: `
        <Suspense>
        <div>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </div>
        </Suspense>`,
    }, {
      components: { FilterInputHierarchy },
      data() {
        return {
          title: "Title",
          modelValue: [],
          rootValue: "",
          hydrationFunction: async () => [],
          getChildren: async (): Promise<[TreeNode[], number]> => ([
            [
              {
                id: 1,
                name: "item1",
                leaf: false,
                children: [],
                childrenLoaded: false,
                showChildren: false,
                count: 0,
                value: "item1",
              },
            ],
            1,
          ]),
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await flushPromises();

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
        <div>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </div>
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
            return [
              Array.from({ length: 10 }, _e => ({ ...child })),
              20,
            ];
          },
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await flushPromises();

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
        <div>
          <FilterInputHierarchy 
            v-model=\"modelValue\" 
            :title=\"title\" 
            :root-value=\"rootValue\" 
            :hydration-function=\"hydrationFunction\"
            :get-children=\"getChildren\"
            :suggestion-function=\"suggestionFunction\"
          />
        </div>
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
            return [
              Array.from({ length: 10 }, _e => ({ ...child })),
              20,
            ];
          },
          suggestionFunction: async () => [],
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();
    await wrapper.find(titleSelector).trigger("click");
    await flushPromises();

    const rootTreeItem = wrapper.get("[data-test=\"tree-item\"]");
    await rootTreeItem.get("[data-test=\"show-children\"]").trigger("click");
    const showMoreButton = rootTreeItem.get("[data-test=\"show-more\"]");
    await showMoreButton.trigger("click");

    expect(rootTreeItem.find("[data-test=\"show-more\"]").exists()).toBe(false);
  });
});
