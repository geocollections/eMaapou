<template>
  <v-card flat>
    <pagination
      v-if="count > 10"
      :paginate-by="options.itemsPerPage"
      :page="options.page"
      :count="count"
      @update:paginateBy="updatePaginateBy($event)"
      @update:page="updatePage($event)"
    />

    <image-view :count="count" :items="items" />
  </v-card>
</template>

<script>
import ImageView from '~/components/ImageView'
import Pagination from '~/components/Pagination'
export default {
  name: 'ImageViewWrapper',
  components: { Pagination, ImageView },
  props: {
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
      }),
    },
  },
  created() {
    this.$emit('update', { options: { ...this.options } })
  },
  methods: {
    updatePaginateBy(paginateBy) {
      this.$emit('update', {
        options: {
          ...this.options,
          itemsPerPage: paginateBy,
          page: 1,
        },
      })
    },

    updatePage(page) {
      this.$emit('update', { options: { ...this.options, page } })
    },
  },
}
</script>

<style scoped></style>
