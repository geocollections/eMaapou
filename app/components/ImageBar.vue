<script setup lang="ts" generic="T">
export interface Image<T> {
  id: number;
  filename: string;
  info: T;
}

defineProps<{ images: Image<T>[]; total: number }>();

const emit = defineEmits<{
  update: [];
}>();
const showOverlay = ref(false);
function loadMore() {
  emit("update");
}
const initIndex = ref(0);
function openOverlay(index: number) {
  initIndex.value = index;
  showOverlay.value = true;
}

function handleEnd() {
  loadMore();
}
</script>

<template>
  <div class="portal-image-strip">
    <div
      v-for="(item, index) in images"
      :key="item.id"
      class="portal-image-strip-item"
    >
      <slot name="image" :item="item">
        <UTooltip>
          <template #content>
            <slot name="tooltipInfo" :item="item" />
          </template><UButton
            color="neutral"
            variant="ghost"
            class="portal-image-trigger"
            :aria-label="$t('common.clickToOpen')"
            @click="openOverlay(index)"
          >
            <NuxtImg
              :src="item.filename"
              provider="geocollections"
              :modifiers="{ size: 'small' }"
              height="175"
              class="portal-image-thumbnail"
            />
          </UButton>
        </UTooltip>
      </slot>
    </div><UButton
      v-if="images.length < total"
      color="neutral"
      variant="outline"
      icon="i-lucide-plus"
      :aria-label="$t('common.showMore')"
      @click="loadMore"
    /><PortalPhotoViewer
      v-if="showOverlay"
      v-model="showOverlay"
      :initial-slide="initIndex"
      :images="images"
      :total="total"
      @end="handleEnd"
    >
      <template #info="{ item }">
        <slot name="overlayInfo" :item="item" />
      </template>
    </PortalPhotoViewer>
  </div>
</template>
