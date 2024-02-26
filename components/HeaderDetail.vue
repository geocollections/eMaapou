<script setup lang="ts">
import { mdiArrowUpLeft, mdiChevronLeft, mdiChevronRight } from "@mdi/js";

const props = defineProps({
  arrowKeys: {
    type: Boolean,
    required: false,
    default: true,
  },
  ids: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    required: false,
    default: "",
  },
  searchTo: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["click:previous", "click:next"]);

const getRouteBaseName = useRouteBaseName();
const { $translate } = useNuxtApp();
const { t } = useI18n({ useScope: "local" });

const routeName = computed(() => {
  return getRouteBaseName()?.split("-id")[0];
});

const prevName = computed(() => {
  if (typeof props.ids?.prev?.name === "object")
    return $translate(props.ids?.prev?.name);

  return props.ids?.prev?.name;
});
const nextName = computed(() => {
  if (typeof props.ids?.next?.name === "object")
    return $translate(props.ids?.next?.name);

  return props.ids?.next?.name;
});

const hasPrevNext = computed(() => {
  return props.ids?.prev || props.ids?.next;
});

onBeforeMount(() => {
  if (props.arrowKeys)
    window.addEventListener("keyup", handleKeyup);
});
onBeforeUnmount(() => {
  if (props.arrowKeys)
    window.removeEventListener("keyup", handleKeyup);
});
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();

function handleKeyup(e) {
  if (e.keyCode === 37) {
    // ArrowLeft
    if (props.ids?.prev) {
      emit("click:previous");
      router.push(
        localePath({
          params: { ...route.params, id: props.ids.prev.id },
        }),
      );
    }
  }
  else if (e.keyCode === 39) {
    // ArrowRight
    if (props.ids?.next) {
      emit("click:next");
      router.push(
        localePath({
          params: { ...route.params, id: props.ids.next.id },
        }),
      );
    }
  }
}

function handlePrev() {
  emit("click:previous");
}

function handleNext() {
  emit("click:next");
}
</script>

<template>
  <BaseHeader>
    <VCardTitle class="d-block pt-1 px-0 pb-3 px-sm-3">
      <div
        style="word-break: normal; flex-wrap: wrap"
        class="d-flex align-start font-weight-medium text-h4"
      >
        <slot>
          {{ title }}
        </slot>
        <EditButton />
      </div>
      <div>
        <slot name="sub" />
      </div>
    </VCardTitle>

    <template #before>
      <div v-if="$vuetify.display.smAndUp" class="d-flex px-0 px-sm-3 pb-0">
        <VBtn
          v-if="hasPrevNext"
          id="previous-id"
          variant="plain"
          icon
          :disabled="!ids?.prev"
          :title="t('previous', { name: prevName })"
          :to="
            localePath({
              params: { ...$route.params, id: ids?.prev?.id },
            })
          "
          @click="handlePrev"
        >
          <VIcon>{{ mdiChevronLeft }}</VIcon>
          <VTooltip location="bottom" activator="#previous-id">
            <span>{{ t("previous", { name: prevName }) }}</span>
          </VTooltip>
        </VBtn>

        <VBtn
          id="back-btn-detail"
          icon
          variant="plain"
          :to="searchTo"
        >
          <VIcon>
            {{ mdiArrowUpLeft }}
          </VIcon>
          <VTooltip location="bottom" activator="#back-btn-detail">
            <span>{{ $t("common.goBack") }}</span>
          </VTooltip>
        </VBtn>
        <div
          class="d-flex align-center montserrat text-grey-darken-1 pt-0 px-0 px-sm-3"
        >
          {{ $t(`breadcrumbs.${routeName}-id`, { id: $route.params.id }) }}
        </div>
        <VBtn
          v-if="hasPrevNext"
          id="next-id"
          icon
          variant="plain"
          :disabled="!ids?.next"
          :title="t('next', { name: nextName })"
          :to="
            localePath({
              params: { ...$route.params, id: ids?.next?.id },
            })
          "
          @click="handleNext"
        >
          <VIcon>{{ mdiChevronRight }}</VIcon>
          <VTooltip location="bottom" activator="#next-id">
            <span>{{ t("next", { name: nextName }) }}</span>
          </VTooltip>
        </VBtn>
      </div>
    </template>
  </BaseHeader>
</template>

<i18n lang="yaml">
et:
  previous: "Eelmine: {name}"
  next: "Järgmine: {name}"
en:
  previous: "Previous: {name}"
  next: "Next: {name}"
</i18n>
