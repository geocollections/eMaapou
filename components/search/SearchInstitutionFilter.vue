<template>
  <base-card-expand
    :active="active"
    :show-body="showInstitutions"
    @click="showInstitutions = $event"
  >
    <template #title>
      <v-icon left>{{ icons.mdiWarehouse }}</v-icon>
      <span>{{ $t('common.showInstitutions') }}</span>
    </template>

    <div class="flex-wrap d-flex flex-column justify-space-between">
      <div v-for="(entity, key) in institutions" :key="key">
        <v-tooltip
          right
          open-delay="200"
          :nudge-left="
            $vuetify.breakpoint.xs || $vuetify.breakpoint.mdAndUp ? '200' : '0'
          "
        >
          <template #activator="{ on }">
            <span v-on="on">
              <v-checkbox
                multiple
                :value="entity.id"
                color="accent lighten-2"
                hide-details
                dense
                :label="entity.acronym"
                :input-value="institution"
                @change="$emit('change:institution', $event)"
              />
            </span>
          </template>

          <span>{{ $translate({ et: entity.name, en: entity.name_en }) }}</span>
        </v-tooltip>
      </div>
    </div>
  </base-card-expand>
</template>

<script>
import { mdiWarehouse } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import BaseCardExpand from '../base/BaseCardExpand.vue'

export default {
  name: 'SearchInstitutionFilter',
  components: { BaseCardExpand },
  props: {
    institution: {
      type: Array,
      required: true,
      default: () => [],
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapFields('settings', {
      showInstitutions: 'showInstitutionFilters',
    }),
    icons() {
      return {
        mdiWarehouse,
      }
    },
    institutions() {
      return [
        {
          id: '1',
          acronym: 'GIT',
          name: 'TalTech geoloogia instituut',
          name_en: 'Department of Geology, TalTech',
        },
        {
          id: '2',
          acronym: 'TUG',
          name: 'TÜ Loodusmuuseum, geoloogia',
          name_en: 'University of Tartu, Natural History Museum, geology',
        },
        {
          id: '3',
          acronym: 'ELM',
          name: 'Eesti Loodusmuuseum, geoloogia',
          name_en: 'Eesti Loodusmuuseum, geoloogia',
        },
        {
          id: '4',
          acronym: 'MUMU',
          name: 'Eesti Maaülikooli mullakogud',
          name_en: 'Eesti Maaülikooli mullakogud',
        },
        {
          id: '5',
          acronym: 'TUGO',
          name: 'Tartu Ülikooli geoloogia osakond',
          name_en: 'Tartu University, Department of Geology',
        },
        {
          id: '6',
          acronym: 'EGK',
          name: 'Eesti Geoloogiakeskus',
          name_en: 'Geological Survey of Estonia (EGK)',
        },
        {
          id: '7',
          acronym: 'EGT',
          name: 'Eesti Geoloogiateenistus',
          name_en: 'Geological Survey of Estonia',
        },
      ]
    },
  },
}
</script>

<style scoped lang="scss">
.card-title--clickable {
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
