<template>
  <div>
    <div class="d-flex">
      <div class="text-h6">{{ $t('common.showSearchFields') }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SearchFieldWrapper',
}
</script>
