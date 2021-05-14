<template>
  <v-fab-transition>
    <v-tooltip right>
      <template #activator="{ on }">
        <v-btn
          fixed
          left
          fab
          small
          dark
          :style="style"
          color="deep-orange darken-2"
          v-on="on"
          @click="handleClick"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.goBack') }}</span>
    </v-tooltip>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'GoBackFab',
  computed: {
    style() {
      return ` z-index: 4;`
    },

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
