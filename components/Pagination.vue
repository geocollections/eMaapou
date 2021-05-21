<template>
  <div
    v-if="count > 0"
    class="px-4 d-flex flex-column flex-sm-row flex-nowrap justify-space-between align-center pagination"
  >
    <div class="mb-2">
      <paginate-by-field
        :value="paginateBy"
        @change="$emit('update:paginateBy', $event)"
      />
    </div>

    <div class="mb-2">
      <v-pagination
        :value="page"
        :class="{
          'justify-end font-small': $vuetify.breakpoint.smAndUp,
          'font-smaller': $vuetify.breakpoint.xsOnly,
        }"
        style="font-size: 0.75rem"
        color="header"
        circle
        :length="Math.ceil(count / paginateBy)"
        :total-visible="
          $vuetify.breakpoint.smAndDown
            ? $vuetify.breakpoint.xsOnly
              ? 4
              : 5
            : 7
        "
        @input="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script>
import PaginateByField from '~/components/fields/PaginateByField'
export default {
  name: 'Pagination',
  components: { PaginateByField },
  props: {
    paginateBy: {
      type: Number,
      required: true,
      default: 25,
    },
    page: {
      type: Number,
      required: true,
      default: 1,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
}
</script>

<style scoped>
.font-small >>> .v-pagination__item {
  font-size: 0.875rem;
}

.font-smaller >>> .v-pagination__item {
  font-size: 0.75rem;
}
</style>
