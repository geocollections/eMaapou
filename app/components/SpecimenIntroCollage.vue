<script setup lang="ts">
const props = defineProps<{ query: string; filters: (string | Record<string, string>)[] }>();
const { t } = useI18n();
const localePath = useLocalePath();
const source = useCollectionImage();
const { data, status, refresh } = await useSolrFetch<SolrResponse>("/specimen_image", {
  query: computed(() => ({
    json: {
      query: props.query,
      filter: props.filters,
      limit: 48,
      fields: "id,image,specimen_id,specimen_full_name",
    },
  })),
});
const failedImages = ref(new Set<string>());
watch(data, () => failedImages.value = new Set());
const images = computed(() => {
  if (status.value !== "success")
    return [];
  const seen = new Set<string>();
  const unique = (data.value?.response.docs ?? []).filter((item: any) => {
    if (!item.image || !item.specimen_id || failedImages.value.has(item.image) || seen.has(String(item.specimen_id)))
      return false;
    seen.add(String(item.specimen_id));
    return true;
  });
  if (unique.length <= 10)
    return unique;
  return Array.from({ length: 10 }, (_, index) => unique[Math.round(index * (unique.length - 1) / 9)]);
});
</script>

<template>
  <figure
    class="specimen-intro-collage"
    :aria-busy="status === 'pending'"
    :aria-label="t('portal.specimenCollage.imagesFromTheGeologicalCollections')"
  >
    <template v-if="status === 'pending'">
      <USkeleton
        v-for="index in 10"
        :key="index"
        class="portal-collage-link"
      />
    </template>
    <template v-else-if="images.length">
      <ULink
        v-for="item in images"
        :key="item.id"
        :to="localePath({ name: 'specimen-id', params: { id: item.specimen_id } })"
        :aria-label="t('portal.specimenCollage.viewSpecimenRecordname', { recordName: item.specimen_full_name || item.specimen_id })"
        class="portal-collage-link"
        :title="item.specimen_full_name || String(item.specimen_id)"
      >
        <img
          :src="source(item.image)"
          :alt="item.specimen_full_name || String(item.specimen_id)"
          width="320"
          height="240"
          decoding="async"
          class="portal-collage-image"
          @error="failedImages.add(item.image)"
        >
      </ULink>
    </template>
    <figcaption v-else class="portal-collage-message">
      <UButton
        v-if="status === 'error'"
        color="neutral"
        variant="outline"
        icon="i-lucide-refresh-cw"
        @click="refresh()"
      >
        {{ t('portal.specimenCollage.retryLoadingImages') }}
      </UButton>
      <span v-else>{{ t('portal.specimenCollage.noImagesMatchTheSelectedFilters') }}</span>
    </figcaption>
  </figure>
</template>
