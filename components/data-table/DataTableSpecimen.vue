<script setup lang="ts">
import type { OverlayImage } from "~/components/ImageOverlay.vue";

const img = useImage();
const localePath = useLocalePath();
const showOverlay = ref(false);
const overlayImage = ref<OverlayImage>();
function openOverlay(image: OverlayImage) {
  overlayImage.value = image;
  showOverlay.value = true;
}
</script>

<template>
  <base-data-table v-bind="$attrs">
    <template #item.id="{ item }">
      <nuxt-link
        v-if="item.id"
        class="text-link"
        :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.specimen_full_name="{ item }">
      <nuxt-link
        v-if="item.specimen_full_name"
        class="text-link"
        :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
      >
        {{ item.specimen_full_name }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
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
      </nuxt-link>
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
      <nuxt-link
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
      </nuxt-link>
    </template>
    <template #item.lithostratigraphy="{ item }">
      <nuxt-link
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
      </nuxt-link>
    </template>
    <template #item.taxon="{ item }">
      <base-link-external
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </base-link-external>
    </template>
    <template #item.image="{ item }">
      <thumbnail-image
        v-if="item.image_preview_url"
        class="my-1"
        :src="
          img(item.image, { size: 'small' }, { provider: 'geocollections' })
        "
        @click="
          openOverlay({
            src: item.image,
            modifiers: { size: 'large' },
            options: { provider: 'geocollections' },
            id: item.attachment_id,
          })
        "
      />
    </template>
    <template #item.name="{ item }">
      <base-link-external
        v-if="item.rock_id"
        @click.native="$openWindow(`https://kivid.info/${item.rock_id}`)"
      >
        {{
          $translate({
            et: item.rock,
            en: item.rock_en,
          })
        }}
      </base-link-external>
      <base-link-external
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </base-link-external>
    </template>
    <template #item.original_status="{ item }">
      {{
        $translate({ et: item.original_status, en: item.original_status_en })
      }}
    </template>
  </base-data-table>
  <image-overlay v-model="showOverlay" :image="overlayImage" />
</template>
