<template>
  <base-data-table
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.id="{ item }">
      <nuxt-link
        v-if="item.attachment_id"
        class="text-link"
        :to="
          localePath({
            name: 'file-id',
            params: { id: item.attachment_id },
          })
        "
      >
        {{ item.attachment_id }}
      </nuxt-link>
    </template>
    <template #item.date="{ item }">
      <div v-if="item.date_created">
        {{ $formatDate(item.date_created) }}
      </div>
      <div v-else>{{ item.date_created_free }}</div>
    </template>

    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference_id"
        @click.native="$openGeology('reference', item.reference_id)"
      >
        {{ item.reference }}
      </base-link-external>
    </template>

    <template #item.type="{ item }">
      <div>{{ getAttachmentType(item.specimen_image_attachment) }}</div>
    </template>

    <template #item.image="{ item }">
      <thumbnail-image
        v-if="item.uuid_filename"
        :src="
          $img(
            `${item.uuid_filename}`,
            { size: 'medium' },
            { provider: 'geocollections' }
          )
        "
        class="ma-2"
        @click="
          $router.push(
            localePath({ name: 'file-id', params: { id: item.attachment_id } })
          )
        "
      />
    </template>
  </base-data-table>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import ThumbnailImage from '~/components/thumbnail/ThumbnailImage'
import BaseLinkExternal from '~/components/base/BaseLinkExternal'
import { HEADERS_ATTACHMENT_SOLR } from '~/constants'
import headersMixin from '~/mixins/headersMixin'
export default {
  name: 'DataTableAttachmentSolr',
  components: { BaseLinkExternal, BaseDataTable, ThumbnailImage },
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
      localHeaders: cloneDeep(HEADERS_ATTACHMENT_SOLR),
    }
  },
  methods: {
    getAttachmentType(type) {
      switch (type) {
        case 1:
          return this.$t('attachment.typeSpecimen')
        case 2:
          return this.$t('attachment.typeImage')
        case 4:
          return this.$t('attachment.typeReference')
        default:
          return this.$t('attachment.typeOther')
      }
    },
  },
}
</script>
