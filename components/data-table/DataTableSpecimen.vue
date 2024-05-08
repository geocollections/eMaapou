<script setup lang="ts">
import type { Image } from "../ImageBar.vue";
import type { ImageFunc } from "~/composables/useImageFunc";

const props = defineProps<{
  imageFunc?: ImageFunc<SpecimenImage>;
}>();

const emit = defineEmits(["click:row"]);

type SpecimenImage = Image<{
  author: string | null;
  date: string | null;
}>;

const img = useImage();
const localePath = useLocalePath();
const showOverlay = ref(false);
const images = ref<SpecimenImage[]>([]);
const totalImage = ref(0);
const rowsPerPage = 10;
const page = ref(0);
const currentSpecimenOverlay = ref<any>();
const initIndex = ref(0);

async function openOverlay(specimen: any) {
  initIndex.value = 0;
  page.value = 0;

  currentSpecimenOverlay.value = specimen;
  if (!props.imageFunc) {
    images.value = [{ id: specimen.attachment_id, filename: specimen.image, info: { author: specimen.image_author, date: specimen.image_date } }];
    totalImage.value = 1;
  }
  else {
    const { images: newImages, total } = await props.imageFunc({ item: specimen, page: page.value, rows: rowsPerPage });
    images.value = newImages;
    totalImage.value = total;
  }

  showOverlay.value = true;
}

async function loadMore() {
  if (!props.imageFunc)
    return;
  if (currentSpecimenOverlay.value === undefined)
    return;
  if (images.value.length >= totalImage.value)
    return;

  page.value += 1;
  const { images: newImages } = await props.imageFunc({ item: currentSpecimenOverlay.value, page: page.value, rows: rowsPerPage });
  images.value = [...images.value, ...newImages];
}

function handleEnd() {
  loadMore();
}
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'specimen-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.specimen_full_name="{ item }">
      {{ item.specimen_full_name }}
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
        v-if="item.locality_id"
        class="text-link"
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
        class="text-link"
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
        class="text-link"
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
      <div class="d-flex align-center">
        <ThumbnailImage
          v-if="item.image_preview_url"
          class="my-1"
          :src="
            img(item.image, { size: 'small' }, { provider: 'geocollections' })
          "
          @click="
            openOverlay(item)
          "
        />
        <span v-if="item.image_count > 1" class="pl-1 text-medium-emphasis font-weight-medium">
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
    <template #item.depthFrom="{ item }">
      <span v-if="item.depth">
        {{
          item.depth.toFixed(2)
        }}
      </span>
    </template>
    <template #item.depthTo="{ item }">
      <span v-if="item.depth_interval">
        {{
          item.depth_interval.toFixed(2)
        }}
      </span>
    </template>
  </BaseDataTable>
  <ImageOverlay
    v-model="showOverlay"
    :initial-slide="initIndex"
    :images="images"
    :total="totalImage"
    @end="handleEnd"
  >
    <template #overlayInfo="{ item }">
      <div v-if="item.info.author">
        <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
        <span>{{ item.info.author }}</span>
      </div>
      <div v-if="item.info.date">
        <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
        <span>
          {{ $formatDate(item.info.date) }}
        </span>
      </div>
    </template>
  </ImageOverlay>
</template>
