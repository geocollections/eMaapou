<template>
  <table-row v-if="value" :title="title">
    <template #value>
      <!-- Changed it into div in order to stop propagation (clicking on boxes in drillcore detail view (stratigraphy link)) -->
      <div v-if="nuxt" class="text-link" @click.stop="$router.push(href)">
        {{ value }}
      </div>
      <!--      <nuxt-link v-if="nuxt" class="text-link" :to="href">{{-->
      <!--        value-->
      <!--      }}</nuxt-link>-->
      <span v-else>
        <base-link-external v-if="href" :href="href" :target="target">
          {{ value }}
        </base-link-external>
        <base-link-external v-else @click.native="$emit('link-click')">
          {{ value }}
        </base-link-external>
      </span>
      <span v-if="suffix">{{ suffix }}</span>
    </template>
  </table-row>
</template>

<script>
export default {
  name: 'TableRowLink',
  props: {
    nuxt: { type: Boolean, default: false },
    title: { type: String, default: null },
    value: { type: [String, Number], default: null, required: false },
    href: { type: String, default: null },
    suffix: { type: String, default: null },
    target: { type: String, default: '_blank' },
  },
}
</script>
