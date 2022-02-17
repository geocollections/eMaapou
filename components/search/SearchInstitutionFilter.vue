<template>
  <base-card-expand
    :active="active"
    :show-body="showInstitutions"
    @click="showInstitutions = $event"
  >
    <template #title>
      <v-icon left>mdi-warehouse</v-icon>
      <span>{{ $t('common.showInstitutions') }}</span>
    </template>

    <div
      class="
        flex-wrap
        d-flex
        flex-column flex-sm-row flex-md-column
        justify-space-between
      "
    >
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
  <!-- <v-card class="px-2 mt-1">
    <v-card-title class="px-0 py-1">
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
        class="flex-wrap d-flex flex-column flex-sm-row flex-md-column justify-space-between"
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
  </v-card> -->
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'
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
    ...mapState('search', ['institutions']),
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
