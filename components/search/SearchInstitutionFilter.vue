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

    <div
      class="flex-wrap d-flex flex-column flex-sm-row flex-md-column justify-space-between"
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
</template>

<script>
import { mdiWarehouse } from '@mdi/js'
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
    icons() {
      return {
        mdiWarehouse,
      }
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
