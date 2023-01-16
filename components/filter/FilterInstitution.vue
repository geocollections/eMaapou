<template>
  <v-expansion-panel style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray"
    >
      {{ $t('filters.institutions') }}
    </v-expansion-panel-header>
    <div
      v-if="value.length > 0"
      class="white pt-1 px-2"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
    >
      <v-chip
        v-for="(institution, i) in selectedInstitutions"
        :key="i"
        color="accent"
        class="mr-1 mb-1"
        small
        close
        @click:close="handleRemove(i)"
      >
        {{ institution.acronym }}
      </v-chip>
    </div>
    <v-expansion-panel-content
      color="white"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
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
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'FilterInstitution',
  props: {
    value: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const icons = computed(() => {
      return {
        mdiWarehouse,
      }
    })
    const institutions = computed(() => {
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
    })
    const selectedInstitutions = computed(() => {
      return institutions.value
        .filter((institution) => props.value.includes(institution.id))
        .sort((a, b) => props.value.indexOf(a.id) - props.value.indexOf(b.id))
    })
    const handleRemove = (i: number) => {
      const cloneItems = cloneDeep(props.value)
      cloneItems.splice(i, 1)
      emit('input', cloneItems)
    }
    return { icons, institutions, selectedInstitutions, handleRemove }
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
