<template>
  <v-card class="mb-4" tile>
    <v-row no-gutters class="page-title">
      <v-col md="9" offset-md="3" class="py-0">
        <div class="d-flex justify-center justify-md-start">
          <v-icon v-if="icon" large left>{{ icon }}</v-icon>
          <h1>
            {{ $t(title, { count: count }) }}
          </h1>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'SearchViewTitle',
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
