<template>
  <table-wrapper
    :items="attachments"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.description="{ item }">
      <a class="text-link" @click="openAttachment(item.id)">{{
        $translate({
          et: item.attachment__description,
          en: item.attachment__description_en,
        })
      }}</a>
    </template>
  </table-wrapper>
</template>

<script>
import { isEmpty } from 'lodash'
import TableWrapper from '~/components/TableWrapper.vue'

export default {
  components: { TableWrapper },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      attachments: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
      },
      headers: [
        { text: this.$t('attachment.description'), value: 'description' },
        {
          text: this.$t('attachment.author'),
          value: 'attachment__author__agent',
        },
      ],
      sortValues: {
        description: () =>
          this.$i18n.locale === 'et'
            ? 'attachment__description'
            : 'attachment__description_en',
        attachment__author__agent: () => 'attachment__author__agent',
      },
    }
  },
  methods: {
    openAttachment(attachment) {
      window.open(
        `https://geocollections.info/file/${attachment}`,
        '_blank',
        'height=800, width=800'
      )
    },
    async handleUpdate(options) {
      let params, multiSearch
      if (!isEmpty(options.search))
        multiSearch = `value:${options.search};fields:${Object.values(
          this.sortValues
        )
          .map((field) => field())
          .join()};lookuptype:icontains`
      if (isEmpty(options.sortBy)) {
        params = {
          multi_search: multiSearch,
          or_search: `drillcore:${this.$route.params.id};locality:${this.locality}`,
          paginate_by: options.itemsPerPage,
          page: options.page,
        }
      } else {
        const orderBy = options.sortBy.map((field, i) => {
          if (options.sortDesc[i]) return `-${this.sortValues[field]()}`
          return this.sortValues[field]()
        })

        params = {
          multi_search: multiSearch,
          or_search: `drillcore:${this.$route.params.id};locality:${this.locality}`,
          paginate_by: options.itemsPerPage,
          page: options.page,
          order_by: orderBy.join(','),
        }
      }
      const attachmentResponse = await this.$axios.$get('attachment_link', {
        params,
      })
      this.attachments = attachmentResponse.results
      this.count = attachmentResponse.count
    },
  },
}
</script>
