<script setup lang="ts">
const img = useImage();
const localePath = useLocalePath();
const imageOverlay = ref();
const showOverlay = ref(false);
const currentOverlaySpecimen = ref<any>();
const initIndex = ref(0);

const specimenImageFunc = useSpecimenImageFunction();
const { images, total, nextImages, reset: resetImages } = useImages(specimenImageFunc);

async function openOverlay(sample: any) {
  resetImages();
  imageOverlay.value.reset();

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
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'specimen-id', params: { id: item.id } })"
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
          v-if="item.image !== undefined"
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
