<script setup lang="ts">
import type { PortalTableProps } from "~/components/PortalDataTable.vue";
import round from "lodash/round";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<PortalTableProps>(), { showSearch: true, dynamicHeaders: true });

const localePath = useLocalePath();
</script>

<template>
  <PortalDataTable v-bind="{ ...$attrs, ...props }" expandable>
    <template #expanded-row="{ item }">
      <div class="portal-expanded-record">
        <div class="portal-row">
          <div class="portal-description-text portal-column">
            <template v-if="item.description">
              <div class="font-bold">
                {{ $t("drillcore.description") }}
              </div>
              <div>
                {{ item.description }}
              </div>
            </template>
          </div>
          <div class="portal-half-column portal-column">
            <table class="portal-metadata-table">
              <tbody>
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
                      :to="externalUrl(`kirjandus.geoloogia.info/reference/${value.id}`)"
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
        class="portal-record-link"
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
        class="portal-record-link"
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
  </PortalDataTable>
</template>
