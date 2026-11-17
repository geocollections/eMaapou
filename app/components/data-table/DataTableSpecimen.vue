<script setup lang="ts">
import type { PortalTableProps } from "~/components/PortalDataTable.vue";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<PortalTableProps>(), { showSearch: true, dynamicHeaders: true });

const emit = defineEmits<{ "click:row": [payload: { index: number; id: number }] }>();
function recordClick(item: any) {
  const index = props.items.findIndex(row => row.id === item.id);
  emit("click:row", {
    index: Math.max(0, index),
    id: Number(item.id),
  });
}
const source = useCollectionImage();
const localePath = useLocalePath();
const showOverlay = ref(false);
const currentOverlaySpecimen = ref<any>();
const initIndex = ref(0);

const specimenImageFunc = useSpecimenImageFunction();
const { images, total, nextImages, reset: resetImages } = useImages(specimenImageFunc);

async function openOverlay(sample: any) {
  resetImages();

  currentOverlaySpecimen.value = sample;
  await nextImages(sample);

  showOverlay.value = true;
}

function handleEnd() {
  if (images.value.length < 1)
    return;
  nextImages(currentOverlaySpecimen.value);
}
</script>

<template>
  <PortalDataTable
    v-bind="{ ...$attrs, ...props }"
    :item-to="(item) => localePath({ name: 'specimen-id', params: { id: item.id } })"
    @click:row="emit('click:row', { index: $event.index, id: Number($event.id) })"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.specimen_full_name="{ item }">
      <NuxtLink
        class="specimen-record-link"
        :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
        @click="recordClick(item)"
      >{{ item.specimen_full_name }}</NuxtLink>
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
        v-if="item.locality_id"
        class="portal-record-link"
        :to="
          localePath({
            name: 'locality-id',
            params: { id: item.locality_id },
          })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </NuxtLink>
      <div v-else>
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </div>
    </template>
    <template #item.kind="{ item }">
      {{
        $translate({
          et: item.specimen_kind,
          en: item.specimen_kind_en,
        })
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <NuxtLink
        v-if="item.stratigraphy_id"
        class="portal-record-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.lithostratigraphy="{ item }">
      <NuxtLink
        v-if="item.lithostratigraphy_id"
        class="portal-record-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.lithostratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.lithostratigraphy,
            en: item.lithostratigraphy_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.taxon="{ item }">
      <BaseLinkExternal
        v-if="item.taxon_id"
        @click="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </BaseLinkExternal>
    </template>
    <template #item.image="{ item }">
      <div class="flex items-center">
        <ThumbnailImage
          v-if="item.image"
          class="my-1"
          :src="
            source(item.image, 'small')
          "
          @click="
            openOverlay(item)
          "
        />
        <span v-if="item.image_count > 1" class="portal-specimen-subtitle">
          +{{ item.image_count - 1 }}
        </span>
      </div>
    </template>
    <template #item.name="{ item }">
      <BaseLinkExternal
        v-if="item.rock_id"
        @click="$openWindow(`https://kivid.info/${item.rock_id}`)"
      >
        {{
          $translate({
            et: item.rock,
            en: item.rock_en,
          })
        }}
      </BaseLinkExternal>
      <BaseLinkExternal
        v-if="item.taxon_id"
        @click="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </BaseLinkExternal>
    </template>
    <template #item.original_status="{ item }">
      {{
        $translate({ et: item.original_status, en: item.original_status_en })
      }}
    </template>
    <template #item.depthCombined="{ item }">
      <span v-if="item.depth != null">{{ Number(item.depth).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}<template v-if="item.depth_interval != null">–{{ Number(item.depth_interval).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}</template></span>
      <span v-else>—</span>
    </template>
    <template #item.depthFrom="{ item }">
      <span v-if="item.depth != null">
        {{
          item.depth.toFixed(2)
        }}
      </span>
    </template>
    <template #item.depthTo="{ item }">
      <span v-if="item.depth_interval != null">
        {{
          item.depth_interval.toFixed(2)
        }}
      </span>
    </template>
  </PortalDataTable>
  <PortalPhotoViewer
    v-model="showOverlay"
    :initial-slide="initIndex"
    :images="images"
    :total="total"
    @end="handleEnd"
  >
    <template #info="{ item }">
      <div v-if="item.info.author">
        <span class="font-bold">{{ $t("photo.author") }}: </span>
        <span>{{ item.info.author }}</span>
      </div>
      <div v-if="item.info.date">
        <span class="font-bold">{{ $t("photo.date") }}: </span>
        <span>
          {{ $formatDate(item.info.date) }}
        </span>
      </div>
    </template>
  </PortalPhotoViewer>
</template>
