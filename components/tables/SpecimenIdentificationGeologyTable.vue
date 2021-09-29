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
    <template #item.rock="{ item }">
      <external-link
        v-if="item.rock"
        @click.native="$openWindow(`https://kivid.info/${item.rock.id}`)"
      >
        {{
          $translate({
            et: item.rock.name,
            en: item.rock.name_en,
          })
        }}
      </external-link>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.agent }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      <div>{{ item.date_identified || item.date_identified_free }}</div>
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.type">
        {{
          $translate({
            et: item.type.value,
            en: item.type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.current="{ item }">
      <boolean-indicator :value="item.current" />
    </template>
  </table-wrapper>
</template>

<script>
import { cloneDeep } from 'lodash'
import ExternalLink from '../ExternalLink.vue'
import BooleanIndicator from '../BooleanIndicator.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY } from '~/constants'
export default {
  name: 'SpecimenIdentificationGeologyTable',
  components: { TableWrapper, ExternalLink, BooleanIndicator },
  mixins: [headersMixin],
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
      localHeaders: cloneDeep(HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY),
    }
  },
}
</script>
