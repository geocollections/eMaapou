<template>
  <v-card flat class="mt-1">
    <v-card-title class="py-1 px-0">
      <div
        class="card-title--clickable"
        @click="showInstitutions = !showInstitutions"
      >
        <span>{{ $t('common.showInstitutions') }}</span>
        <v-icon class="pb-1">mdi-warehouse</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="showInstitutions = !showInstitutions">
        <v-icon>{{
          showInstitutions ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="showInstitutions" class="px-0 pb-3">
      <div
        class="d-flex flex-column flex-sm-row flex-md-column flex-wrap justify-space-between"
      >
        <div v-for="(entity, key) in institutions" :key="key">
          <v-tooltip
            bottom
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
                  hide-details
                  :label="entity.acronym"
                  :input-value="institution"
                  @change="$emit('change:institution', $event)"
                />
              </span>
            </template>

            <span>{{
              $translate({ et: entity.name, en: entity.name_en })
            }}</span>
          </v-tooltip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'

export default {
  name: 'InstitutionSearchFilter',
  props: {
    institution: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    ...mapState('globalSearch', ['institutions']),
    ...mapFields('settings', {
      showInstitutions: 'showInstitutionFilters',
    }),
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
