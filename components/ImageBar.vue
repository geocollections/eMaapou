<template>
  <div>
    <div class="text-h5 font-weight-medium">
      {{ $t('common.images') }}
    </div>
    <div class="d-flex align-center pb-0" style="overflow-x: auto">
      <div v-for="(item, index) in images" :key="index" class="mr-4 my-3">
        <v-tooltip bottom color="accent">
          <template #activator="{ on, attrs }">
            <slot name="image" :item="item" :on="on" :attrs="attrs">
              <v-hover v-slot="{ hover }">
                <v-img
                  v-bind="attrs"
                  :src="
                    $img(
                      `${item.filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  :lazy-src="
                    $img(
                      `${item.filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  max-width="200"
                  max-height="200"
                  :class="{
                    'elevation-2': hover,
                  }"
                  class="grey lighten-2 rounded transition-swing cursor-pointer"
                  v-on="on"
                  @click="
                    $router.push(
                      localePath({
                        name: 'file-id',
                        params: { id: item.id.toString() },
                      })
                    )
                  "
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      />
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
                <span class="font-weight-bold"
                  >{{ $t('locality.date') }}:
                </span>
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

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
  setup() {},
})
</script>
