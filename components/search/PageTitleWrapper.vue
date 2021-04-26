<template>
  <v-card class="mb-4">
    <page-title
      :icon="icon"
      :title="title"
      :subtitle="$t('common.count', { count: count })"
    />
  </v-card>
</template>

<script>
import PageTitle from '~/components/PageTitle'
export default {
  name: 'PageTitleWrapper',
  components: { PageTitle },
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped></style>
