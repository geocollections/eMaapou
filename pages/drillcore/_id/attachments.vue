<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
    :items="attachments"
    :options.sync="options"
    :server-items-length="totalCount"
    :footer-props="footerProps"
    @update:options="handleOptionsChange"
  >
    <template #item.description="{ item }">
      <a class="text-link" @click="openAttachment(item.id)">{{
        $translate({
          et: item.attachment__description,
          en: item.attachment__description_en,
        })
      }}</a>
    </template>
  </v-data-table>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      attachments: [],
      totalCount: 0,
      options: { itemsPerPage: 25 },
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
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
    async handleOptionsChange(options) {
      let params
      if (isEmpty(options.sortBy)) {
        params = {
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
      this.totalCount = attachmentResponse.count
    },
  },
}
</script>
