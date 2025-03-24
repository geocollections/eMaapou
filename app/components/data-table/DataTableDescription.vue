<script setup lang="ts">
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import round from "lodash/round";

const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable expandable v-bind="$attrs">
    <template #expanded-row="{ columns, item }">
      <tr>
        <td class="py-2" :colspan="columns.length">
          <VRow no-gutters>
            <VCol class="pt-2 pb-4 pr-2">
              <template v-if="item.description">
                <div class="font-weight-bold">
                  {{ $t("drillcore.description") }}
                </div>
                <div>
                  {{ item.description }}
                </div>
              </template>
            </VCol>
            <VCol cols="12" md="6">
              <BaseTable>
                <TableRow
                  :title="$t('localityDescription.zeroLevel')"
                  :value="item.zero_level"
                />
                <TableRow
                  :title="$t('localityDescription.authorFree')"
                  :value="item.author_free"
                />
                <TableRow
                  v-if="item.reference"
                  :title="$t('localityDescription.reference')"
                  :value="item.reference"
                >
                  <template #value="{ value }">
                    <BaseLinkExternal
                      :to="`https://kirjandus.geoloogia.info/reference/${value.id}`"
                    >
                      {{
                        value.reference
                      }}
                    </BaseLinkExternal>
                  </template>
                </TableRow>
                <TableRow
                  :title="$t('localityDescription.year')"
                  :value="item.year"
                />
                <TableRow
                  :title="$t('localityDescription.stratigraphyFree')"
                  :value="item.stratigraphy_free"
                />
                <TableRow
                  v-if="item.rock"
                  :title="$t('localityDescription.rockEt')"
                  :value="item.rock.name"
                />
                <TableRow
                  v-if="item.rock"
                  :title="$t('localityDescription.rockEn')"
                  :value="item.rock.name_en"
                />
                <TableRow
                  :title="$t('localityDescription.remarks')"
                  :value="item.remarks"
                />
              </BaseTable>
            </VCol>
          </VRow>
        </td>
      </tr>
    </template>
    <template #item.rock="{ item }">
      <div v-if="item.rock">
        {{ $translate({ et: item.rock.name, en: item.rock.name_en }) }}
      </div>
    </template>
    <template #item.thickness="{ item }">
      {{
        item.depth_base !== null && item.depth_top !== null
          ? Math.abs(round(item.depth_base - item.depth_top, 3)).toFixed(2)
          : null
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <NuxtLink
        v-if="item.stratigraphy"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy.id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy.name,
            en: item.stratigraphy.name_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.author="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        class="text-link"
        :class="{ 'is-preferred': !item.is_preferred }"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
      <div
        v-else-if="item.author"
        :class="{ 'is-preferred': !item.is_preferred }"
      >
        {{ item.author.name }}
      </div>
      <div v-else :class="{ 'is-preferred': !item.is_preferred }">
        {{ item.author_free }}
      </div>
    </template>
    <template #item.depthFrom="{ item }">
      <span v-if="item.depth_top !== null">
        {{
          item.depth_top.toFixed(2)
        }}
      </span>
    </template>
    <template #item.depthTo="{ item }">
      <span v-if="item.depth_base !== null">
        {{
          item.depth_base.toFixed(2)
        }}
      </span>
    </template>
    <template #item.data-table-expand="{ item, internalItem, toggleExpand, isExpanded }">
      <VBtn
        v-if="item.canExpand"
        icon
        variant="text"
        size="small"
        @click="toggleExpand(internalItem)"
      >
        <VIcon>
          {{
            isExpanded(internalItem)
              ? mdiChevronUp
              : mdiChevronDown
          }}
        </VIcon>
      </VBtn>
    </template>
  </BaseDataTable>
</template>
