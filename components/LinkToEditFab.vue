<template>
  <v-fab-transition>
    <v-tooltip left>
      <template #activator="{ on }">
        <v-btn
          fixed
          right
          fab
          small
          dark
          :style="style"
          color="deep-orange darken-2"
          v-on="on"
          @click="handleClick"
        >
          <v-icon>mdi-square-edit-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.linkToEdit') }}</span>
    </v-tooltip>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'LinkToEditFab',
  fetchOnServer: false,
  data() {
    return {
      isLoggedIn: false,
    }
  },
  async fetch() {
    const isLoggedInRespones = await this.$services.sarvRwapi.isLoggedIn()
    this.isLoggedIn = !!isLoggedInRespones?.results?.success
  },
  computed: {
    style() {
      return ` z-index: 4;`
    },

    table() {
      return this.$route.name.substring(0, this.$route.name.indexOf('-'))
    },
  },
  created() {
    this.interval = setInterval(() => this.refreshIsLoggedIn(), 60000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    refreshIsLoggedIn() {
      this.$fetch()
    },

    handleClick() {
      let table = this.table
      if (table === 'photo' || table === 'file') table = 'attachment'
      this.$openEdit(table, this.$route.params.id)
    },
  },
}
</script>

<style scoped></style>
