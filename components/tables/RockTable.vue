<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <external-link
        v-if="item.id"
        @click.native="$openWindow(`https://kivid.info/${item.id}`)"
      >
        {{ item.id }}
      </external-link>
    </template>

    <template #item.formula="{ item }">
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else>{{ item.formula }}</div>
    </template>

    <template #item.in_estonia="{ item }">
      <v-icon v-if="item.in_estonia" color="green" small>mdi-check-bold</v-icon>
      <v-icon v-else color="red" small>mdi-close-thick</v-icon>
    </template>

    <template #item.mindat_id="{ item }">
      <external-link
        v-if="item.mindat_id"
        @click.native="
          $openWindow(`https://www.mindat.org/min-${item.mindat_id}.html`)
        "
      >
        {{ item.mindat_id }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'RockTable',
  components: { ExternalLink, TableWrapper },
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
  },
  data() {
    return {
      headers: [
        { text: this.$t('rock.id'), value: 'id' },
        { text: this.$t('rock.name'), value: 'name' },
        { text: this.$t('rock.name_en'), value: 'name_en' },
        { text: this.$t('rock.formula'), value: 'formula' },
        { text: this.$t('rock.in_estonia'), value: 'in_estonia' },
        { text: this.$t('rock.mindat'), value: 'mindat_id' },
      ],
    }
  },
}
</script>
