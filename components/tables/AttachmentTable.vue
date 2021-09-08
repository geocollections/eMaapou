<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :items="items"
    :headers="headers"
    :count="count"
    :options="options"
    v-on="$listeners"
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
    // ??? Why is this needed
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
          value: 'agent',
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
