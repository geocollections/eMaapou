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
const previewImages = computed(() => galleryItems.value.map(item => ({
  id: Number(item.id),
  filename: item.image,
  info: { ...item, title: item.specimen_full_name },
})));
function openOverlay(index: number) {
  initIndex.value = index;
  showOverlay.value = true;
}
watch(() => props.items, () => {
  showOverlay.value = false;
  failedImages.value = new Set();
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
    >
      <template #info="{ item }">
        <p v-if="item?.info.agent || item?.info.author_free" class="portal-supporting">
          {{ item.info.agent || item.info.author_free }}
        </p>
      </template>
      <template #actions="{ item, index }">
        <UButton
          v-if="item"
          color="neutral"
          variant="outline"
          :to="localePath({ name: 'specimen-id', params: { id: item.info.specimen_id } })"
          @click="emit('click:record', { index, id: Number(item.info.specimen_id) })"
        >
          {{ labels.record }}
        </UButton>
      </template>
    </PortalPhotoViewer>
  </section>
</template>
