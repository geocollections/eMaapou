<template>
  <div class="d-flex justify-space-between">
    <nuxt-link
      class="text-link"
      :to="
        localePath({
          params: { id: parseInt($route.params.id) - 1 },
        })
      "
    >
      {{ $t('common.previous') }}
    </nuxt-link>

    <nuxt-link
      class="text-link"
      :to="
        localePath({
          params: { id: parseInt($route.params.id) + 1 },
        })
      "
    >
      {{ $t('common.next') }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'PrevNextNav',
}
</script>
