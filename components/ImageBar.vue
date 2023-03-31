<template>
  <div class="d-flex align-center pb-0" style="overflow-x: auto">
    <div v-for="(item, index) in images" :key="index" class="mr-3 mb-1">
      <v-tooltip bottom color="accent">
        <template #activator="{ on, attrs }">
          <slot name="image" :item="item" :on="on" :attrs="attrs">
            <v-hover v-slot="{ hover }">
              <v-img
                v-bind="attrs"
                :src="
                  $img(
                    `${item.filename}`,
                    { size: 'medium' },
                    { provider: 'geocollections' }
                  )
                "
                width="250"
                aspect-ratio="1.4"
                :class="{
                  'elevation-2': hover,
                }"
                class="lighten-2 rounded transition-swing cursor-pointer"
                v-on="on"
                @click="
                  openOverlay({
                    src: item.filename,
                    modifiers: { size: 'large' },
                    options: { provider: 'geocollections' },
                    id: item.id,
                  })
                "
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </v-hover>
          </slot>
        </template>
        <slot name="info" :item="item">
          <div v-if="item.author || item.date || item.dateText">
            <div v-if="item.author">
              <span class="font-weight-bold"
                >{{ $t('locality.author') }}:
              </span>
              <span>{{ item.author }}</span>
            </div>
            <div v-if="item.date || item.dateText">
              <span class="font-weight-bold">{{ $t('locality.date') }}: </span>
              <span v-if="item.date">
                {{ $formatDate(item.date) }}
              </span>
              <span v-else>{{ item.dateText }}</span>
            </div>
          </div>
          <div v-else>{{ $t('common.clickToOpen') }}</div>
        </slot>
      </v-tooltip>
    </div>
    <div v-intersect="loadMore" />
    <image-overlay v-model="showOverlay" :image="overlayImage" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { mdiInformationOutline } from '@mdi/js'
import ImageOverlay, { OverlayImage } from './ImageOverlay.vue'

type Image = {
  id: number
  filename: string
  author?: string
  date?: string
  dateText?: string
}

export default defineComponent({
  name: 'ImageBar',
  components: { ImageOverlay },
  props: {
    images: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },
  },
  setup(_props, { emit }) {
    const rowsPerPage = 10
    const state = reactive({
      page: 1,
    })
    const showOverlay = ref(false)
    const overlayImage = ref<OverlayImage>()
    const loadMore = () => {
      emit('update', { page: state.page, rows: rowsPerPage })
      state.page += 1
    }
    const openOverlay = (image: OverlayImage) => {
      overlayImage.value = image
      showOverlay.value = true
    }
    const icons = computed(() => ({ mdiInformationOutline }))
    return {
      showOverlay,
      overlayImage,
      loadMore,
      openOverlay,
      icons,
    }
  },
})
</script>
