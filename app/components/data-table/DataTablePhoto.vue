<script setup lang="ts">
const localePath = useLocalePath();
const img = useImage();
const photoArchiveImageFunc = usePhotoArchiveImageFunction();
const { images, total, nextImages, reset: resetImages } = useImages(photoArchiveImageFunc);
const imageOverlay = ref();
const showOverlay = ref(false);
const currentOverlayImage = ref<any>();
const initIndex = ref(0);

async function openOverlay(sample: any) {
  resetImages();
  imageOverlay.value.reset();

  currentOverlayImage.value = sample;
  await nextImages(sample);

  showOverlay.value = true;
}

function handleEnd() {
  if (images.value.length < 1)
    return;
  nextImages(currentOverlayImage.value);
}
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'file-id', params: { id: item.id } })"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.image_number="{ item }">
      {{ item.image_number }}
    </template>
    <template #item.title="{ item }">
      {{ $translate({ et: item.title, en: item.title_en }) }}
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </NuxtLink>
    </template>

    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent }}
      </div>
      <div v-else>
        {{ item.author_free }}
      </div>
    </template>
    <template #item.date="{ item }">
      <div v-if="item.date_created">
        {{ $formatDate(item.date_created) }}
      </div>
      <div v-else>
        {{ item.date_created_free }}
      </div>
    </template>
    <template #item.image="{ item }">
      <div class="d-flex align-center">
        <ThumbnailImage
          v-if="item.filename !== undefined"
          class="my-1"
          :src="
            img(item.filename, { size: 'small' }, { provider: 'geocollections' })
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
      <div v-if="item.info.date">
        <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
        <span>
          {{ $formatDate(item.info.date) }}
        </span>
      </div>
    </template>
  </ImageOverlay>
</template>
