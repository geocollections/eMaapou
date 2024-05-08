<script setup lang="ts">
import type { SampleImage } from "~/composables/useImageFunc";

const props = defineProps<{
  imageFunc?: ImageFunc<SampleImage>;
}>();
const emit = defineEmits(["click:row"]);

const localePath = useLocalePath();
const img = useImage();

const images = ref<SampleImage[]>([]);
const totalImage = ref(0);
const showOverlay = ref(false);
const rowsPerPage = 10;
const page = ref(0);
const currentSampleOverlay = ref<any>();
const initIndex = ref(0);

async function openOverlay(sample: any) {
  initIndex.value = 0;
  page.value = 0;

  currentSampleOverlay.value = sample;
  if (!props.imageFunc) {
    images.value = [{ id: sample.attachment_id, filename: sample.image, info: { author: sample.image_author, date: sample.image_date } }];
    totalImage.value = 1;
  }
  else {
    const { images: newImages, total } = await props.imageFunc({ sample: sample.id, page: page.value, rows: rowsPerPage });
    images.value = newImages;
    totalImage.value = total;
  }

  showOverlay.value = true;
}

async function loadMore() {
  if (!props.imageFunc)
    return;
  if (currentSampleOverlay.value === undefined)
    return;
  if (images.value.length >= totalImage.value)
    return;

  page.value += 1;
  const { images: newImages } = await props.imageFunc({ sample: currentSampleOverlay.value.id, page: page.value, rows: rowsPerPage });
  images.value = [...images.value, ...newImages];
}

function handleEnd() {
  loadMore();
}
</script>

<template>
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'sample-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.number="{ item }">
      {{ item.number }}
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
      <NuxtLink
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ $translate({ et: item.site_name, en: item.site_name_en }) }}
      </NuxtLink>
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
        v-if="item.lithostratigraphy"
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
    <template #item.date_collected="{ item }">
      {{ item.date_collected ? $formatDate(item.date_collected) : null }}
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
  </BaseDataTable>
  <ImageOverlay
    v-model="showOverlay"
    :initial-slide="initIndex"
    :images="images"
    :total="totalImage"
    @end="handleEnd"
  >
    <template #tooltipInfo="{ item }">
      <div v-if="item.info.author">
        <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
        <span>{{ item.info.author }}</span>
      </div>
      <div v-if="item.info.date || item.info.dateText">
        <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
        <span v-if="item.info.date">
          {{ $formatDate(item.info.date) }}
        </span>
        <span v-else>{{ item.info.dateText }}</span>
      </div>
    </template>
    <template #overlayInfo="{ item }">
      <div v-if="item.info.author">
        <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
        <span>{{ item.info.author }}</span>
      </div>
      <div v-if="item.info.date || item.info.dateText">
        <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
        <span v-if="item.info.date">
          {{ $formatDate(item.info.date) }}
        </span>
        <span v-else>{{ item.info.dateText }}</span>
      </div>
    </template>
  </ImageOverlay>
</template>
