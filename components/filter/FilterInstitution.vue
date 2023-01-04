<template>
  <v-expansion-panel style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray"
    >
      {{ $t('filters.institutions') }}
    </v-expansion-panel-header>
    <v-expansion-panel-content
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="flex-wrap d-flex flex-column justify-space-between">
        <div v-for="(entity, key) in institutions" :key="key">
          <v-tooltip
            right
            open-delay="200"
            :nudge-left="
              $vuetify.breakpoint.xs || $vuetify.breakpoint.mdAndUp
                ? '200'
                : '0'
            "
          >
            <template #activator="{ on }">
              <span v-on="on">
                <v-checkbox
                  multiple
                  :value="entity.id"
                  color="accent"
                  hide-details
                  dense
                  :input-value="value"
                  @change="$emit('input', $event)"
                >
                  <template #label>
                    <div
                      class="text-body-2"
                      style="
                        color: rgba(0, 0, 0, 0.87) !important;
                        font-size: 0.9375rem !important;
                      "
                    >
                      {{ entity.acronym }}
                    </div>
                  </template>
                </v-checkbox>
              </span>
            </template>

            <span>{{
              $translate({ et: entity.name, en: entity.name_en })
            }}</span>
          </v-tooltip>
        </div>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mdiWarehouse } from '@mdi/js'
import { defineComponent, PropType } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'FilterInstitution',
  props: {
    value: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  computed: {
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
})
</script>

<style scoped lang="scss">
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
}
</style>
