import { joinURL } from "ufo";

// import {} from '~image'
import type { ProviderGetImage } from "@nuxt/image";

export const getImage: ProviderGetImage = (
  src: string,
  { modifiers, baseURL } = {},
  _ctx,
) => {
  if (modifiers) {
    const { size } = modifiers;
    return {
      url: joinURL(baseURL as string, size as string, src),
    };
  }
  return {
    url: joinURL(baseURL as string, src),
  };
};
