export interface Image<T> {
  id: number;
  filename: string;
  info: T;
}

type SpecimenImage = Image<{
  author: string | null;
  date: string | null;
}>;

type SampleImage = Image<{
  author: string | null;
  date: string | null;
  dateText: string | null;
}>;

export interface ImageFunc<IT, T = any> {
  (params: { item: T; page: number; rows: number }): Promise<{ images: IT[]; total: number }>;
}

export function useSpecimenImageFunction<T = any>() {
  const { $solrFetch } = useNuxtApp();
  const imageFunc: ImageFunc<SpecimenImage, T> = async ({ item, page, rows }) => {
    const res = await $solrFetch<SolrResponse>("/attachment", {
      query: {
        q: "*",
        fq: `specimen_id:${item.id} AND specimen_image_attachment:1`,
        // sort: "date_created_dt desc,date_created_free desc,stars desc,id desc",
        limit: rows,
        offset: rows * page,
      },
    });

    const newImages = res.response.docs.map((attachment: any) => ({
      id: attachment.id,
      filename: attachment.filename,
      info: {
        author: attachment.agent,
        date: attachment.date_created,
      },
    }));
    return { images: newImages, total: res.response.numFound };
  };
  return imageFunc;
}

export function useSampleImageFunction<T = any>() {
  const { $geoloogiaFetch } = useNuxtApp();
  const imageFunc: ImageFunc<SampleImage, T> = async ({ item, page, rows }) => {
    const res = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
      query: {
        sample: item.id,
        attachment__attachment_format__value__istartswith: "image",
        nest: 2,
        limit: rows,
        offset: page * rows,
      },
    });

    const newImages = res.results.map((image: any) => ({
      id: image.attachment.id,
      filename: image.attachment.filename,
      info: {
        author: image.attachment.author?.agent,
        date: image.attachment.date_created,
        dateText: image.attachment.date_created_free,
      },
    }));
    return { images: newImages, total: res.count };
  };
  return imageFunc;
}
