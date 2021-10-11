<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.file="{ item }">
      <attachment-cell
        v-if="item.attachment"
        :src="
          $img(
            `${item.attachment.filename}`,
            { size: 'small' },
            { provider: 'geocollections' }
          )
        "
        :type="item.attachment.attachment_format.value"
        @click="
          $router.push(
            localePath({ name: 'file-id', params: { id: item.attachment.id } })
          )
        "
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
  </table-wrapper>
</template>

<script>
import { cloneDeep } from 'lodash'
import TableWrapper from './TableWrapper.vue'
import AttachmentCell from '~/components/AttachmentCell.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_ATTACHMENT } from '~/constants'

export default {
  name: 'AttachmentTable',
  components: { TableWrapper, AttachmentCell },
  mixins: [headersMixin],
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
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_ATTACHMENT),
    }
  },
}
</script>
