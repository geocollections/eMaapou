<script>
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

export default {
  name: "BaseCardExpand",
  props: {
    showBody: {
      type: Boolean,
      default: false,
      require: true,
    },
    title: {
      type: String,
      default: "Title",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    icons() {
      return {
        mdiChevronUp,
        mdiChevronDown,
      };
    },
  },
};
</script>

<template>
  <VCard :class="{ active }">
    <!-- NOTE: Font size should be set with class 'text-body-1', but it overrides font-family -->
    <VCardTitle
      class="px-2 py-1 montserrat card-title--clickable"
      style="font-size: 1rem; cursor: pointer"
      @click="$emit('click', !showBody)"
    >
      <slot name="title" :show-body="showBody">
        {{ title }}
      </slot>
      <VSpacer />
      <VBtn icon @click.stop="$emit('click', !showBody)">
        <VIcon>
          {{ showBody ? icons.mdiChevronUp : icons.mdiChevronDown }}
        </VIcon>
      </VBtn>
    </VCardTitle>
    <VExpandTransition>
      <slot name="body" :show-body="showBody">
        <div v-show="showBody">
          <div class="pb-3 pt-1">
            <slot />
          </div>
        </div>
      </slot>
    </VExpandTransition>
  </VCard>
</template>

<style scoped lang="scss">
.card-title--clickable {
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
.active {
  border: 2px solid var(--v-accent-lighten2);
}
</style>
