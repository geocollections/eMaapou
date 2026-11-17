import type { ImageOptions } from "@nuxt/image";
import "@nuxt/image";

declare global {
  interface Window {
    _paq: any[] | undefined;
  }

  type Nullable<T> = T | null;
}

declare module "@nuxt/image" {
  interface ImageModifiers {
    size?: "small" | "medium" | "large";
  }
  interface Img {
    (source: string, modifiers: Partial<ImageModifiers> | undefined, options: Omit<ImageOptions, "provider"> & { provider: "geocollections" }): string;
  }
}
