<script setup lang="ts">
defineProps<{
  activator?: Element;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:model-value": [value: boolean];
}>();
</script>

<template>
  <VMenu
    :model-value="modelValue"
    :activator="activator"
    offset-y
    :close-on-content-click="false"
    content-class="mt-2 elevation-3"
    :open-on-focus="true"
    max-width="650"
    @update:model-value="emit('update:model-value', $event)"
  >
    <div elevation="0">
      <div class="pa-3">
        <div no-gutters>
          <div cols="12" sm="6">
            <div class="d-flex mb-1 align-center">
              <code class="text-black font-weight-bold">"Viki puurauk"</code>
              <div class="ml-2">
                {{ $t("hints.exact") }}
              </div>
            </div>
            <div class="d-flex mb-1 align-center">
              <code class="text-black font-weight-bold">+Keila</code>
              <div class="ml-2">
                {{ $t("hints.require") }}
              </div>
            </div>
          </div>
          <div cols="12" sm="6">
            <div class="d-flex mb-1 align-center">
              <code class="text-black font-weight-bold">Viki*</code>
              <div class="ml-2">
                {{ $t("hints.wildcard") }}
              </div>
            </div>
            <div class="d-flex mb-1 align-center">
              <code class="text-black font-weight-bold">-Pärnu</code>
              <div class="ml-2">
                {{ $t("hints.exclude") }}
              </div>
            </div>
            <!-- <div class="d-flex mb-1 align-center">
              <code class="black--text font-weight-bold">+Eesti +Soome</code>
              <div class="ml-2">{{ $t('hints.requireBoth') }}</div>
            </div> -->
            <!-- <div class="d-flex mb-1 align-center">
              <code class="black--text font-weight-bold"
                >+"Keila lade" -Bryozoa</code
              >
              <div class="ml-2">{{ $t('hints.combineOperators') }}</div>
            </div> -->
          </div>
          <div cols="12">
            <div class="d-flex">
              <code class="text-black font-weight-bold">+"Keila lade" -Bryozoa</code>
              <div class="ml-2">
                {{ $t("hints.combineOperators") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </VMenu>
</template>
