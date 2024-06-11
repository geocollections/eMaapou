import { describe, expect, it, vi } from "vitest";

describe("useImages", () => {
  it("page increases", async () => {
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      return { images: [], total: 0, hasNext: true };
    };
    const { page, nextImages } = useImages(imageFunc);
    expect(page.value).toEqual(0);
    await nextImages({ id: 1 });
    expect(page.value).toEqual(1);
  });

  it("total is set", async () => {
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      return { images: [], total: 10, hasNext: true };
    };
    const { total, nextImages } = useImages(imageFunc);
    expect(total.value).toEqual(0);
    await nextImages({ id: 1 });
    expect(total.value).toEqual(10);
  });

  it("finished is set if end is reached", async () => {
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      return { images: [], total: 10, hasNext: false };
    };
    const { finished, nextImages } = useImages(imageFunc);
    expect(finished.value).toEqual(false);
    await nextImages({ id: 1 });
    expect(finished.value).toEqual(true);
  });

  it("call image func when next images requested", async () => {
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      return { images: [], total: 10, hasNext: true };
    };
    const func = { imageFunc };
    const spy = vi.spyOn(func, "imageFunc");

    const { nextImages } = useImages(func.imageFunc);
    await nextImages({ id: 1 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("image func not called after finished", async () => {
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      return { images: [], total: 10, hasNext: false };
    };
    const mock = { imageFunc };
    const spy = vi.spyOn(mock, "imageFunc");

    const { nextImages } = useImages(mock.imageFunc);
    await nextImages({ id: 1 });
    expect(spy).toHaveBeenCalledTimes(1);
    await nextImages({ id: 1 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("image func not called when loading", async () => {
    vi.useFakeTimers();
    const imageFunc: ImageFunc<{ test: string }> = vi.fn(async (_args) => {
      await new Promise(res => setTimeout(res, 200));
      return { images: [{ test: "test" }], total: 10, hasNext: true };
    });
    const { nextImages } = useImages(imageFunc);

    // eslint-disable-next-line ts/no-floating-promises
    nextImages({ id: 1 });
    await vi.advanceTimersByTimeAsync(100);
    // eslint-disable-next-line ts/no-floating-promises
    nextImages({ id: 1 });

    expect(imageFunc).toHaveBeenCalledTimes(1);
  });

  it("images are appended", async () => {
    let i = 0;
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      i++;
      return { images: [{ test: `test${i}` }], total: 10, hasNext: true };
    };
    const { images, nextImages } = useImages(imageFunc);
    expect(images.value).toStrictEqual([]);
    await nextImages({ id: 1 });
    expect(images.value).toStrictEqual([{ test: "test1" }]);
    await nextImages({ id: 1 });
    expect(images.value).toStrictEqual([{ test: "test1" }, { test: "test2" }]);
  });

  it("images are not appended when finished", async () => {
    const imageFunc: ImageFunc<{ test: string }> = async (_args) => {
      return { images: [{ test: "test" }], total: 10, hasNext: false };
    };
    const { images, nextImages } = useImages(imageFunc);
    expect(images.value).toStrictEqual([]);
    await nextImages({ id: 1 });
    expect(images.value).toStrictEqual([{ test: "test" }]);
    await nextImages({ id: 1 });
    expect(images.value).toStrictEqual([{ test: "test" }]);
  });
});
