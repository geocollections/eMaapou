<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :items="items"
    :headers="headers"
    :count="count"
    :init-options="options"
    v-on="$listeners"
  >
    <template #item.file="{ item }">
      <attachment-cell
        :src="`https://files.geocollections.info/small/${item.attachment__filename}`"
        :type="item.attachment__attachment_format__value"
        @click="
          $router.push(localePath({ name: 'file-id', params: { id: item.id } }))
        "
      />
    </template>
    <template #item.description="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'file-id', params: { id: item[idField] } })"
      >
        {{
          $translate({
            et: item.attachment__description,
            en: item.attachment__description_en,
          })
        }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '~/components/tables/TableWrapper.vue'
import AttachmentCell from '~/components/AttachmentCell.vue'

export default {
  name: 'AttachmentTable',
  components: { TableWrapper, AttachmentCell },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    externalOptions: {
      type: Boolean,
      default: false,
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
    idField: {
      type: String,
      required: false,
      default: 'id',
    },
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('attachment.file'),
          value: 'file',
          width: '120px',
          sortable: false,
        },
        { text: this.$t('attachment.description'), value: 'description' },
        {
          text: this.$t('attachment.author'),
          value: 'attachment__author__agent',
        },
      ],
      queryFields: {
        description: () =>
          this.$i18n.locale === 'et'
            ? 'attachment__description'
            : 'attachment__description_en',
        attachment__author__agent: () => 'attachment__author__agent',
      },
    }
  },
}
</script>
