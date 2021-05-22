<template>
  <div
    class="d-flex justify-center py-2 emp-title text-center"
    :class="titleColor"
  >
    <v-icon v-if="icon" large left color="white">{{ icon }}</v-icon>
    <div class="d-flex flex-column">
      <h1 style="font-size: 1.75rem">
        {{ title }}
      </h1>
      <h3 v-if="subtitle" style="opacity: 0.7">
        {{ subtitle }}
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    icon: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    titleColor() {
      let name = this.getRouteBaseName()
      if (name.includes('-')) name = name.split('-')[0]
      if (name === 'analysis' || name === 'analytical_data')
        return 'emp-analysis'
      if (name === 'dataset') return 'emp-dataset'
      if (name === 'preparation' || name === 'sample') return 'emp-sample'
      if (name === 'area') return 'emp-main'
      if (name === 'locality') return 'emp-locality'
      if (name === 'site') return 'emp-site'
      if (name === 'drillcore' || name === 'drillcore_box')
        return 'emp-drillcore'
      if (name === 'file' || name === 'photo') return 'emp-photo' // #bfbe8b or #8c6d4e
      if (name === 'stratigraphy') return 'emp-stratigraphy'
      return 'emp-main'
    },
  },
}
</script>

<style scoped></style>
