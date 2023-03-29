<template>
  <v-menu transition="slide-y-transition" offset-y bottom right z-index="4">
    <template #activator="menu">
      <v-tooltip bottom open-delay="500">
        <template #activator="tooltip">
          <v-btn
            aria-label="export table"
            class="mr-1"
            v-bind="{ ...menu.attrs, ...tooltip.attrs }"
            icon
            v-on="{ ...menu.on, ...tooltip.on }"
          >
            <v-icon>{{ icons.mdiFileExportOutline }}</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('table.tooltipExport') }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="handleExportCsv">
        <v-list-item-title>CSV</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleExportExcel">
        <v-list-item-title>XLSX (Excel)</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleClipboard">
        <v-list-item-title>
          {{ $t('common.clipboard') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { mdiFileExportOutline } from '@mdi/js'
import {
  computed,
  defineComponent,
  PropType,
  useContext,
} from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'BaseDataTableExportMenu',
  props: {
    tableElement: {
      type: undefined as unknown as PropType<HTMLElement>,
      required: true,
    },
  },
  setup(props) {
    const icons = computed(() => {
      return {
        mdiFileExportOutline,
      }
    })
    const { $writeFileXLSX, $xlsxUtils } = useContext()
    const removeSortIndicators = (table: HTMLElement) => {
      const tableCopy = table.cloneNode(true)
      // @ts-ignore
      const sortIndicators = tableCopy.querySelectorAll(
        'thead > tr > th > .v-data-table-header__sort-badge'
      )
      sortIndicators.forEach((indicator: any) => {
        indicator.parentElement.removeChild(indicator)
      })
      return tableCopy
    }
    const createWorkbook = (table: HTMLElement) => {
      const tableCopy = removeSortIndicators(table)
      const wb = $xlsxUtils.table_to_book(tableCopy)
      return wb
    }
    const handleExportCsv = () => {
      try {
        const wb = createWorkbook(props.tableElement)

        $writeFileXLSX(wb, 'export.csv', { bookType: 'csv' })
      } catch (err) {}
    }
    const handleExportExcel = () => {
      try {
        const wb = createWorkbook(props.tableElement)

        $writeFileXLSX(wb, 'export.xlsx', { bookType: 'xlsx' })
      } catch (err) {}
    }
    const handleClipboard = () => {
      const body = document.body
      let range
      let sel: Selection | null
      if (document.createRange && window.getSelection) {
        range = document.createRange()
        sel = window.getSelection()
        sel?.removeAllRanges()
        try {
          range.selectNodeContents(props.tableElement)
          sel?.addRange(range)
        } catch (e) {
          range.selectNode(props.tableElement)
          sel?.addRange(range)
        }
        sel?.removeAllRanges()
      } else if ((body as any).createTextRange) {
        range = (body as any).createTextRange()
        range.moveToElementText(props.tableElement)
        range.select()
      }
      document.execCommand('Copy')
    }
    return { icons, handleClipboard, handleExportCsv, handleExportExcel }
  },
})
</script>
