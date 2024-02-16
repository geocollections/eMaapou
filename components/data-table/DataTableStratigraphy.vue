<template>
  <base-data-table v-bind="$attrs">
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>

    <template #item.index_main="{ item }">
      <div v-if="item.index_main_html" v-html="item.index_main_html" />
      <div v-else>{{ item.index_main }}</div>
    </template>

    <template #item.index_additional="{ item }">
      <div
        v-if="item.index_additional_html"
        v-html="item.index_additional_html"
      />
      <div v-else>{{ item.index_additional }}</div>
    </template>

    <template #item.stratigraphy_type="{ item }">
      <div>
        {{
          $translate({
            et: item.stratigraphy_type,
            en: item.stratigraphy_type_en,
          })
        }}
      </div>
    </template>

    <template #item.stratigraphy_rank="{ item }">
      <div>
        {{
          $translate({
            et: item.stratigraphy_rank,
            en: item.stratigraphy_rank_en,
          })
        }}
      </div>
    </template>

    <template #item.stratigraphy_scope="{ item }">
      <div>
        {{
          $translate({
            et: item.stratigraphy_scope,
            en: item.stratigraphy_scope_en,
          })
        }}
      </div>
    </template>

    <template #item.age_stratigraphy="{ item }">
      <div>
        {{
          $translate({
            et: item.age_stratigraphy,
            en: item.age_stratigraphy_en,
          })
        }}
      </div>
    </template>

    <template #item.ageBase="{ item }">
      {{ item.age_base }}
    </template>
    <template #item.ageTop="{ item }">
      {{ item.age_top }}
    </template>

    <template #item.parent_stratigraphy="{ item }">
      <nuxt-link
        v-if="item.parent_id"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.parent_id },
          })
        "
      >
        {{
          $translate({
            et: item.parent_stratigraphy,
            en: item.parent_stratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
