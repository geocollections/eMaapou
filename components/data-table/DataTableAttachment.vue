<template>
  <base-data-table
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset"
  >
    <template #item.file="{ item }">
      <thumbnail-attachment
        v-if="item.attachment"
        :src="
          $img(
            `${item.attachment.filename}`,
            { size: 'large' },
            { provider: 'geocollections' }
          )
        "
        :preview-src="
          $img(
            `${item.attachment.filename}`,
            { size: 'small' },
            { provider: 'geocollections' }
          )
        "
        :type="item.attachment.attachment_format.value"
      />
    </template>
    <template #item.description="{ item }">
      <nuxt-link
        v-if="item.attachment"
        class="text-link"
        :to="
          localePath({ name: 'file-id', params: { id: item.attachment.id } })
        "
      >
        {{
          $translate({
            et: item.attachment.description,
            en: item.attachment.description_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.attachment && item.attachment.author">
        {{ item.attachment.author.agent }}
      </div>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import ThumbnailAttachment from '~/components/thumbnail/ThumbnailAttachment.vue'
import { HEADERS_ATTACHMENT } from '~/constants'

export default defineComponent({
  name: 'DataTableAttachment',
  components: { BaseDataTable, ThumbnailAttachment },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      }),
    },
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_ATTACHMENT,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
