<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
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
        {{ new Date(item.date_created).toISOString().split('T')[0] }}
      </div>
      <div v-else>{{ item.date_created_free }}</div>
    </template>

    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference_id"
        @click.native="$openGeology('reference', item.reference_id)"
      >
        {{ item.reference }}
      </external-link>
    </template>

    <template #item.type="{ item }">
      <div>{{ getAttachmentType(item.specimen_image_attachment) }}</div>
    </template>

    <template #item.image="{ item }">
      <image-cell
        v-if="item.uuid_filename"
        :src="`https://files.geocollections.info/medium/${item.uuid_filename}`"
        class="ma-2"
        @click="
          $router.push(
            localePath({ name: 'file-id', params: { id: item.attachment_id } })
          )
        "
      />
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
import ImageCell from '@/components/ImageCell'
import ExternalLink from '~/components/ExternalLink'
// import AttachmentCell from '~/components/AttachmentCell'
export default {
  name: 'AttachmentSolrTable',
  components: { ExternalLink, TableWrapper, ImageCell },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
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
      headers: [
        { text: this.$t('attachment.id'), value: 'id' },
        { text: this.$t('attachment.format'), value: 'format_value' },
        { text: this.$t('attachment.image_number'), value: 'image_number' },
        { text: this.$t('attachment.author'), value: 'agent' },
        { text: this.$t('attachment.date'), value: 'date' },
        { text: this.$t('attachment.reference'), value: 'reference' },
        { text: this.$t('attachment.type'), value: 'type' },
        { text: this.$t('attachment.image'), value: 'image', sortable: false },
      ],
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
