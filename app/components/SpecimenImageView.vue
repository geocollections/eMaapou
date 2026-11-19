<script setup lang="ts">
const props = withDefaults(defineProps<{ items: any[]; count: number; options: DataTableOptions; loading?: boolean; error?: boolean }>(), { loading: false, error: false });
const emit = defineEmits<{ "update": [payload: { options: DataTableOptions }]; "retry": []; "click:record": [payload: { index: number; id: number }] }>();
const localePath = useLocalePath();
const source = useCollectionImage();
const { locale } = useI18n();
const labels = computed(() => locale.value === "et"
  ? {
      title: "Eksemplaride pildid",
      preview: "Ava foto",
      record: "Vaata eksemplari",
      specimen: "Eksemplar",
      imageNumber: "Foto number",
      author: "Autor / pildistaja",
      date: "Pildistamise aeg",
      metadataLoading: "Laadin foto andmeid…",
      metadataError: "Foto andmete laadimine ebaõnnestus.",
      locality: "Leiukoht",
      imageId: "Foto ID",
      loading: "Laadin pilte…",
      empty: "Pilte ei leitud. Muuda otsingut või eemalda filtrid.",
      failed: "Piltide laadimine ebaõnnestus.",
      retry: "Proovi uuesti",
      unavailable: "Pilti ei saanud laadida.",
      note: "Ava foto suuremalt või vali katalooginumber eksemplari andmete vaatamiseks.",
    }
  : {
      title: "Specimen images",
      preview: "Enlarge image",
      record: "View specimen",
      specimen: "Specimen",
      imageNumber: "Image number",
      author: "Author / photographer",
      date: "Image date",
      metadataLoading: "Loading photograph details…",
      metadataError: "Could not load photograph details.",
      locality: "Locality",
      imageId: "Image ID",
      loading: "Loading images…",
      empty: "No images found. Adjust your search or clear the filters.",
      failed: "Could not load images.",
      retry: "Try again",
      unavailable: "Image could not be loaded.",
      note: "Enlarge a photograph or select its catalogue number to view the specimen record.",
    });
const galleryItems = computed(() => props.items.filter(item => item.image));
const failedImages = ref(new Set<string>());
const showOverlay = ref(false);
const initIndex = ref(0);
const { $solrFetch } = useNuxtApp();
interface AttachmentMetadata {
  id: string | number;
  agent?: string;
  author_free?: string;
  date_created?: string;
  date_created_free?: string;
  image_number?: string;
}
const attachmentMetadata = ref<Record<string, AttachmentMetadata>>({});
const metadataLoading = ref(false);
const metadataError = ref(false);
const metadataPageKey = ref("");
const previewImages = computed(() => galleryItems.value.map(item => ({
  id: Number(item.id),
  filename: item.image,
  info: {
    ...item,
    ...attachmentMetadata.value[String(item.id)],
    title: item.specimen_full_name,
  },
})));
async function loadAttachmentMetadata() {
  const ids = galleryItems.value
    .map(item => String(item.id))
    .filter(id => /^\d+$/.test(id));
  const pageKey = ids.join(",");
  if (!pageKey || metadataPageKey.value === pageKey || metadataLoading.value)
    return;

  metadataLoading.value = true;
  metadataError.value = false;
  try {
    const response = await $solrFetch<{
      response: { docs: AttachmentMetadata[] };
    }>("/attachment", {
      query: {
        json: {
          query: `id:(${ids.join(" OR ")})`,
          limit: ids.length,
          fields: "id,agent,author_free,date_created,date_created_free,image_number",
        },
      },
    });
    attachmentMetadata.value = Object.fromEntries(
      response.response.docs.map(item => [
        String(item.id),
        item,
      ]),
    );
    metadataPageKey.value = pageKey;
  }
  catch (error) {
    console.error("Could not load specimen image metadata.", error);
    metadataError.value = true;
  }
  finally {
    metadataLoading.value = false;
  }
}
function openOverlay(index: number) {
  initIndex.value = index;
  showOverlay.value = true;
  void loadAttachmentMetadata();
}
watch(() => props.items, () => {
  showOverlay.value = false;
  failedImages.value = new Set();
  attachmentMetadata.value = {};
  metadataPageKey.value = "";
  metadataError.value = false;
});
</script>

<template>
  <section
    class="specimen-gallery"
    :aria-label="labels.title"
    :aria-busy="loading"
  >
    <div class="specimen-gallery__intro">
      <p>{{ labels.note }}</p><span>{{ count.toLocaleString(locale) }} {{ locale === 'et' ? 'pilti' : 'images' }}</span>
    </div>
    <div
      v-if="error"
      class="specimen-gallery__message"
      role="alert"
    >
      {{ labels.failed }} <UButton
        color="neutral"
        variant="link"
        @click="emit('retry')"
      >
        {{ labels.retry }}
      </UButton>
    </div>
    <p
      v-else-if="loading && !items.length"
      class="specimen-gallery__message"
      role="status"
    >
      {{ labels.loading }}
    </p>
    <p
      v-else-if="!items.length"
      class="specimen-gallery__message"
      role="status"
    >
      {{ labels.empty }}
    </p>
    <div
      v-else
      class="specimen-gallery__grid"
      tabindex="0"
      :aria-label="labels.title"
    >
      <article
        v-for="(item, index) in galleryItems"
        :key="item.id"
        class="specimen-gallery__card"
      >
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          class="specimen-gallery__photo header-focus"
          :aria-label="`${labels.preview}: ${item.specimen_full_name || item.specimen_id}`"
          :disabled="failedImages.has(item.image)"
          @click="openOverlay(index)"
        >
          <img
            v-if="!failedImages.has(item.image)"
            :src="source(item.image)"
            :alt="item.specimen_full_name || String(item.specimen_id)"
            loading="lazy"
            width="400"
            height="300"
            @error="failedImages.add(item.image)"
          >
          <span v-else>{{ labels.unavailable }}</span>
          <span
            v-if="!failedImages.has(item.image)"
            class="specimen-gallery__enlarge"
            aria-hidden="true"
          >↗</span>
        </UButton>
        <div class="specimen-gallery__caption">
          <NuxtLink
            :to="localePath({ name: 'specimen-id', params: { id: item.specimen_id } })"
            :aria-label="`${labels.record}: ${item.specimen_full_name || item.specimen_id}`"
            @click="emit('click:record', { index, id: Number(item.specimen_id) })"
          >{{ item.specimen_full_name || item.specimen_id }}</NuxtLink>
          <p v-if="item.agent || item.author_free">
            {{ item.agent || item.author_free }}
          </p>
          <p v-if="item.date_created || item.date_created_free">
            {{ item.date_created?.split('T')[0] || item.date_created_free }}
          </p>
        </div>
      </article>
    </div>
    <PortalPagination
      :options="options"
      :count="count"
      :loading="loading"
      images
      @update="emit('update', { options: $event })"
    />
    <PortalPhotoViewer
      v-if="showOverlay"
      v-model="showOverlay"
      :images="previewImages"
      :initial-slide="initIndex"
      large-preview
    >
      <template #info="{ item }">
        <p class="mb-1 text-xs font-medium text-portal-muted">
          {{ labels.specimen }}
        </p>
        <h2 class="text-lg leading-snug font-semibold text-portal-heading">
          {{ item?.info.specimen_full_name || item?.info.specimen_id }}
        </h2>
        <p
          v-if="metadataLoading"
          class="mt-3 text-sm text-portal-muted"
          role="status"
        >
          {{ labels.metadataLoading }}
        </p>
        <p
          v-if="metadataError"
          class="mt-3 text-sm text-portal-error"
          role="alert"
        >
          {{ labels.metadataError }}
          <UButton
            color="neutral"
            variant="link"
            class="ml-1"
            @click="loadAttachmentMetadata"
          >
            {{ labels.retry }}
          </UButton>
        </p>
        <dl class="portal-photo-metadata">
          <div v-if="item?.info.image_number">
            <dt>{{ labels.imageNumber }}</dt>
            <dd>{{ item.info.image_number }}</dd>
          </div>
          <div v-if="item?.info.agent || item?.info.author_free">
            <dt>{{ labels.author }}</dt>
            <dd>{{ item.info.agent || item.info.author_free }}</dd>
          </div>
          <div v-if="item?.info.date_created || item?.info.date_created_free">
            <dt>{{ labels.date }}</dt>
            <dd>{{ item.info.date_created?.split("T")[0] || item.info.date_created_free }}</dd>
          </div>
          <div v-if="item?.info.locality || item?.info.locality_en">
            <dt>{{ labels.locality }}</dt>
            <dd>{{ locale === "et" ? (item.info.locality || item.info.locality_en) : (item.info.locality_en || item.info.locality) }}</dd>
          </div>
          <div v-if="item?.id">
            <dt>{{ labels.imageId }}</dt>
            <dd>{{ item.id }}</dd>
          </div>
        </dl>
      </template>
      <template #actions="{ item, index }">
        <div v-if="item" class="flex flex-wrap gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :to="localePath({ name: 'specimen-id', params: { id: item.info.specimen_id } })"
            @click="emit('click:record', { index, id: Number(item.info.specimen_id) })"
          >
            {{ labels.record }}
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-download"
            :href="source(item.filename, 'large')"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ locale === "et" ? "Laadi foto alla" : "Download photograph" }}
          </UButton>
        </div>
      </template>
    </PortalPhotoViewer>
  </section>
</template>
