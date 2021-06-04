<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn small text v-on="on" @click="handleClick">
        <v-icon>mdi-subdirectory-arrow-left mdi-rotate-90</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('common.goBack') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'GoBackButton',
  computed: {
    table() {
      return this.$route.name.substring(0, this.$route.name.indexOf('-'))
    },
  },
  methods: {
    handleClick() {
      let table = this.table
      if (table === 'photo' || table === 'file') table = 'photo'
      else if (table === 'area') table = 'site'
      this.$router.push(this.localePath({ name: table }))
    },
  },
}
</script>

<style scoped></style>
