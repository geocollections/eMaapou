<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.language="{ item }">
      <div v-if="item.language">
        {{
          $translate({ et: item.language.value, en: item.language.value_en })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        @click="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>
  </BaseDataTable>
</template>
