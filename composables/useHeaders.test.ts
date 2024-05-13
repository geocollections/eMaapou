// @vitest-environment nuxt
import { describe, expect, it } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { Headers } from "#imports";

const testHeaders: Headers = {
  byIds: {
    foo: {
      title: "skip translate",
      value: "foo",
      titleTranslate: false,
      show: true,
    },
    bar: {
      title: "bar",
      value: "bar",
      titleTranslate: true,
      show: true,
    },
    baz: {
      title: "skip translate",
      value: "baz",
      titleTranslate: false,
      show: false,
    },
  },
  allIds: ["foo", "baz", "bar"],
};

const testHeadersComplex: Headers = {
  byIds: {
    foo: {
      title: "skip translate",
      value: "foo",
      titleTranslate: false,
      show: true,
    },
    bar: {
      title: "bar",
      value: "bar",
      titleTranslate: true,
      show: true,
    },
    baz: {
      title: "skip translate",
      value: "baz",
      titleTranslate: false,
      show: false,
      children: [
        {
          title: "skip translate",
          value: "childFoo",
          titleTranslate: false,
          apiFieldValue: "depth",
        },
        {
          title: "childBar",
          value: "childBar",
          apiFieldValue: "depth_interval",
        },
      ],
    },
  },
  allIds: ["foo", "bar", "baz"],
};

mockNuxtImport("useI18n", () => {
  return () => ({
    t: (_key: string) => "translated",
  });
});

describe("useHeaders", () => {
  it("should return headers in order of allIds", () => {
    const { headers } = useHeaders(testHeaders);

    expect(headers.value.length).toBe(testHeaders.allIds.length);
    expect(headers.value[0].value).toBe("foo");
    expect(headers.value[1].value).toBe("baz");
    expect(headers.value[2].value).toBe("bar");
  });

  it("should translate headers", () => {
    const { headers } = useHeaders(testHeaders);

    expect(headers.value[0].title).toBe("skip translate");
    expect(headers.value[1].title).toBe("skip translate");
    expect(headers.value[2].title).toBe("translated");
  });

  it("should toggle header visibility", () => {
    const { headers, handleHeadersChange } = useHeaders(testHeaders);

    expect(headers.value[0].show).toBe(testHeaders.byIds.foo.show);
    handleHeadersChange("foo");
    expect(headers.value[0].show).toBe(!testHeaders.byIds.foo.show);
    handleHeadersChange("foo");
    expect(headers.value[0].show).toBe(testHeaders.byIds.foo.show);
  });

  it("should reset headers", () => {
    const { headers, handleHeadersReset, handleHeadersChange } = useHeaders(testHeaders);

    handleHeadersChange("foo");
    handleHeadersReset({ sortBy: [], page: 1, itemsPerPage: 25 });

    expect(headers.value[0].show).toBe(true);
    expect(headers.value[1].show).toBe(false);
    expect(headers.value[2].show).toBe(true);
  });
  it("should reset headers, but skip ones that are used in sorting", () => {
    const { headers, handleHeadersReset, handleHeadersChange } = useHeaders(testHeaders);

    handleHeadersChange("foo");
    handleHeadersReset({ sortBy: [{ key: "baz", order: "asc" }], page: 1, itemsPerPage: 25 });

    expect(headers.value[0].show).toBe(true);
    expect(headers.value[1].show).toBe(true);
    expect(headers.value[2].show).toBe(true);
  });

  it("should add headers", () => {
    const { headers, addHeaders } = useHeaders(testHeaders);

    const newHeaders = {
      byIds: {
        qux: {
          title: "qux",
          value: "qux",
          titleTranslate: true,
          show: true,
        },
      },
      allIds: ["qux"],
    };
    addHeaders(newHeaders);

    expect(headers.value.length).toBe(4);
    expect(headers.value[3].value).toBe("qux");
  });

  it("should translate child headers", () => {
    const { headers } = useHeaders(testHeadersComplex);

    expect(headers.value[2].children?.[0].title).toBe("skip translate");
    expect(headers.value[2].children?.[1].title).toBe("translated");
  });
});
