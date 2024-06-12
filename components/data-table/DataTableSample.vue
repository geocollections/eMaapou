<script setup lang="ts">
const emit = defineEmits<{
  "click:row": [payload: { index: number; id: string }];
}>();

const localePath = useLocalePath();
const img = useImage();

const imageOverlay = ref();
const showOverlay = ref(false);
const currentOverlaySample = ref<any>();
const initIndex = ref(0);

const sampleImageFunc = useSampleImageFunction();
const { images, total, nextImages, reset: resetImages } = useImages(sampleImageFunc);

async function openOverlay(sample: any) {
  resetImages();
  imageOverlay.value.reset();

  currentOverlaySample.value = sample;
  await nextImages(sample);

  showOverlay.value = true;
}

function handleEnd() {
  if (images.value.length < 1)
    return;
  nextImages(currentOverlaySample.value);
}
</script>

<template>
  <!-- @vue-ignore -->
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
          v-if="item.image"
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
    ref="imageOverlay"
    v-model="showOverlay"
    :initial-slide="initIndex"
    :images="images"
    :total="total"
    @end="handleEnd"
  >
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
