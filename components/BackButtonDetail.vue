<template>
  <v-btn id="back-btn-detail" icon small text @click="handleClick">
    <v-icon>mdi-subdirectory-arrow-left mdi-rotate-90</v-icon>
    <v-tooltip bottom activator="#back-btn-detail">
      <span>{{ $t('common.goBack') }}</span>
    </v-tooltip>
  </v-btn>
</template>

<script>
export default {
  name: 'BackButtonDetail',
  computed: {
    table() {
      return this.$route.name.substring(0, this.$route.name.indexOf('-'))
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
