<template>
  <v-btn id="back-btn-detail" icon @click="handleClick">
    <v-icon style="transform: rotate(90deg)">
      {{ icons.mdiSubdirectoryArrowLeft }}
    </v-icon>
    <v-tooltip bottom activator="#back-btn-detail">
      <span>{{ $t('common.goBack') }}</span>
    </v-tooltip>
  </v-btn>
</template>

<script>
import { mdiSubdirectoryArrowLeft } from '@mdi/js'
export default {
  name: 'BackButtonDetail',
  computed: {
    table() {
      return this.$route.name.substring(0, this.$route.name.indexOf('-'))
    },
    icons() {
      return {
        mdiSubdirectoryArrowLeft,
      }
    },
  },
  methods: {
    handleClick() {
      let table = this.table
      if (table === 'photo' || table === 'file') table = 'photo'

      this.$router.push(this.localePath({ name: table }))
    },
  },
}
</script>

<style scoped></style>
