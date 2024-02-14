<template>
  <base-data-table v-bind="$attrs">
    <template #item.id="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.number="{ item, index }">
      <nuxt-link
        v-if="item.number"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.number }}
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
      <nuxt-link
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ $translate({ et: item.site_name, en: item.site_name_en }) }}
      </nuxt-link>
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
      </nuxt-link>
    </template>
    <template #item.date_collected="{ item }">
      {{ item.date_collected ? $formatDate(item.date_collected) : null }}
    </template>
    <template #item.depth="{ item }">
      <span style="font-family: monospace">
        {{
          formatDepthRange({
            depthFrom: item.depth,
            depthTo: item.depth_interval,
          })
        }}
      </span>
    </template>
    <template #item.image="{ item }">
      <thumbnail-image
        v-if="item.image_preview_url"
        class="my-1"
        :src="item.image_preview_url"
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
  </base-data-table>
  <image-overlay v-model="showOverlay" :image="overlayImage" />
</template>

<script setup lang="ts">
import type { OverlayImage } from "~/components/ImageOverlay.vue";

const emit = defineEmits(["click:row"]);

const localePath = useLocalePath();
const showOverlay = ref(false);
const overlayImage = ref<OverlayImage>();
const openOverlay = (image: OverlayImage) => {
  overlayImage.value = image;
  showOverlay.value = true;
};

function formatDepthRange({
  depthFrom,
  depthTo,
}: {
  depthFrom?: number;
  depthTo?: number;
}) {
  if (!depthFrom) {
    return depthTo?.toFixed(2);
  }
  if (!depthTo) {
    return depthFrom.toFixed(2);
  }
  if (depthFrom === depthTo) {
    return depthFrom.toFixed(2);
  }
  return `${depthFrom.toFixed(2)} - ${depthTo.toFixed(2)}`;
}
</script>
