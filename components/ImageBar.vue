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
                  openOverlay(
                    $img(
                      `${item.filename}`,
                      { size: 'large' },
                      { provider: 'geocollections' }
                    )
                  )
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
    <v-dialog v-model="showOverlay" content-class="elevation-0" width="auto">
      <div @click="showOverlay = !showOverlay">
        <v-img contain :max-height="700" :src="overlayImageSrc" />
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
} from '@nuxtjs/composition-api'

type Image = {
  id: number
  filename: string
  author?: string
  date?: string
  dateText?: string
}

export default defineComponent({
  name: 'ImageBar',
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
    const overlayImageSrc = ref<String | null>(null)
    const loadMore = () => {
      emit('update', { page: state.page, rows: rowsPerPage })
      state.page += 1
    }
    const openOverlay = (src: String) => {
      overlayImageSrc.value = src
      showOverlay.value = true
    }
    return { showOverlay, overlayImageSrc, loadMore, openOverlay }
  },
})
</script>
