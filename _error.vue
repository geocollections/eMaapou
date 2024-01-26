<template>
  <v-main>
    <v-container :fluid="$vuetify.display.lgAndDown">
      <v-row no-gutters>
        <v-col>
          <div class="pt-15">
            <detail-error :error="error" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
defineProps<{
  error: Object;
}>();
</script>
