export interface Image<T> {
  id: number;
  filename: string;
  info: T;
}

export type SpecimenImage = Image<{
  author: string | null;
  date: string | null;
}>;

export type SampleImage = Image<{
  author: string | null;
  date: string | null;
  dateText: string | null;
}>;

export type PreparationImage = Image<{
  author: string | null;
  date: string | null;
  dateText: string | null;
}>;

export type PhotoArchiveImage = Image<{
  author: string | null;
  date: string | null;
}>;

export interface ImageFunc<IT, T = { id: any;[K: string]: any }> {
  (params: { item: T; page: number; rows: number }): Promise<{ images: IT[]; total: number; hasNext: boolean }>;
}

export function useImages<IT, T>(imageFunc: ImageFunc<IT, T>) {
  const page = ref(0);
  const rows = ref(10);
  const total = ref(0);
  const finished = ref(false);
  const loading = ref(false);
  const images = ref<IT[]>([]) as Ref<IT[]>;

  async function nextImages(item: T) {
    if (finished.value)
      return;
    if (loading.value)
      return;

    loading.value = true;
    const { images: newImages, total: totalImages, hasNext } = await imageFunc({ item, page: page.value, rows: rows.value });
    page.value += 1;
    images.value = [...images.value, ...newImages];
    total.value = totalImages;
    finished.value = !hasNext;
    loading.value = false;
  }

  function reset() {
    page.value = 0;
    images.value = [];
    total.value = 0;
    finished.value = false;
    loading.value = false;
  }

  return { images, nextImages, reset, page, rows, total, finished };
}

export function useSpecimenImageFunction() {
  const { $solrFetch } = useNuxtApp();
  const imageFunc: ImageFunc<SpecimenImage> = async ({ item, page, rows }) => {
    const res = await $solrFetch<SolrResponse>("/attachment", {
      query: {
        q: "*",
        fq: `specimen_id:${item.id} AND specimen_image_attachment:1`,
        // sort: "date_created_dt desc,date_created_free desc,stars desc,id desc",
        rows,
        start: rows * page,
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
    return { images: newImages, total: res.response.numFound, hasNext: res.response.numFound > rows * (page + 1) };
  };
  return imageFunc;
}

export interface ImageAttachment {
  id: number;
  filename: string;
  author: Nullable<{
    name: string;
  }>;
  date_created: Nullable<string>;
  date_created_text: Nullable<string>;
}
export function useSampleImageFunction() {
  const { $apiFetch } = useNuxtApp();
  const imageFunc: ImageFunc<SampleImage> = async ({ item, page, rows }) => {
    const res = await $apiFetch<GeoloogiaListResponse<ImageAttachment>>(`/samples/${item.id}/attachments/`, {
      query: {
        mime_type__content_type__istartswith: "image",
        fields: "id,filename,author.name,date_created,date_created_text",
        limit: rows,
        offset: page * rows,
      },
    });

    const newImages = res.results.map(image => ({
      id: image.id,
      filename: image.filename,
      info: {
        author: image.author?.name ?? null,
        date: image.date_created,
        dateText: image.date_created_text,
      },
    }));
    return { images: newImages, total: res.count, hasNext: res.next !== null };
  };
  return imageFunc;
}

export function usePreparationImageFunction() {
  const { $apiFetch } = useNuxtApp();
  const imageFunc: ImageFunc<PreparationImage> = async ({ item, page, rows }) => {
    const res = await $apiFetch<GeoloogiaListResponse<ImageAttachment>>(`/preparations/${item.id}/attachments/`, {
      query: {
        mime_type__content_type__istartswith: "image",
        fields: "id,filename,author.name,date_created,date_created_text",
        limit: rows,
        offset: page * rows,
      },
    });

    const newImages = res.results.map(image => ({
      id: image.id,
      filename: image.filename,
      info: {
        author: image.author?.name ?? null,
        date: image.date_created,
        dateText: image.date_created_text,
      },
    }));
    return { images: newImages, total: res.count, hasNext: res.next !== null };
  };
  return imageFunc;
}

export function usePhotoArchiveImageFunction() {
  const { $solrFetch } = useNuxtApp();
  const imageFunc: ImageFunc<PhotoArchiveImage> = async ({ item, page, rows }) => {
    const res = await $solrFetch<SolrResponse>("/attachment", {
      query: {
        q: "*",
        fq: `id:${item.id}`,
        rows,
        start: rows * page,
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
    return { images: newImages, total: res.response.numFound, hasNext: res.response.numFound > rows * (page + 1) };
  };
  return imageFunc;
}
