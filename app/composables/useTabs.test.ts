// @vitest-environment nuxt
import { describe, expect, it } from "vitest";

describe("useTabs", () => {
  it("should hydrate tab count", async () => {
    const tabs = {
      test: {
        type: "dynamic",
        routeName: "area-id-sites",
        title: "area.sites",
        count: async () => {
          return 1;
        },
        props: {},
      } satisfies Tab,
    };

    const { hydrateTabs } = useTabs();

    const hydratedTabs = await hydrateTabs(tabs, { props: {} });

    expect(hydratedTabs.test.count).toBe(1);
  });

  it("should hydrate tab props", async () => {
    const tabs = {
      test: {
        type: "dynamic",
        routeName: "area-id-sites",
        title: "area.sites",
        count: async () => {
          return 1;
        },
        props: {},
      } satisfies Tab,
    };

    const { hydrateTabs } = useTabs();

    const hydratedTabs = await hydrateTabs(tabs, { props: { test: { foo: "bar" } } });

    expect(hydratedTabs.test.props).toStrictEqual({ foo: "bar" });
  });

  it("should filter out empty tabs", async () => {
    const tabs = {
      foo: {
        type: "dynamic" as const,
        routeName: "foo",
        title: "foo",
        count: 1,
        props: {},
      },
      bar: {
        type: "dynamic" as const,
        routeName: "bar",
        title: "bar",
        count: 0,
        props: {},
      },
    };

    const { filterHydratedTabs } = useTabs();

    const filteredTabs = filterHydratedTabs(tabs, ["foo", "bar"]);

    expect(filteredTabs.length).toStrictEqual(1);
    expect(filteredTabs[0]!.routeName).toStrictEqual("foo");
  });

  it("should not filter out static tabs", async () => {
    const tabs = {
      foo: {
        type: "static" as const,
        routeName: "foo",
        title: "foo",
        props: {},
      },
    };

    const { filterHydratedTabs } = useTabs();

    const filteredTabs = filterHydratedTabs(tabs, ["foo"]);

    expect(filteredTabs.length).toStrictEqual(1);
  });
});
