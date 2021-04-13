<template>
  <v-card class="mb-4" tile>
    <v-row no-gutters class="tertiary">
      <v-col md="9" offset-md="3" class="py-0">
        <div class="d-flex justify-center justify-md-start">
          <v-icon v-if="icon" large left>{{ icon }}</v-icon>
          <div class="d-flex flex-column">
            <h1 style="font-size: 1.75rem">
              {{ $t(title) }}
            </h1>
            <h4 style="opacity: 0.7">
              {{ $t('common.count', { count: count }) }}
            </h4>
          </div>
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
