import type BaseDataTable from "~/components/base/BaseDataTable.vue";

export function useBaseDataTableAttrs() {
  return useAttrs() as ReturnType<typeof useAttrs> & InstanceType<typeof BaseDataTable>["$props"];
}
