/* eslint-disable no-unused-vars */
declare module 'vuex-map-fields' {
  interface Mapper<R> {
    <Key extends string>(map: Key[]): { [K in Key]: R }
    <Map extends Record<string, string>>(map: Map): { [K in keyof Map]: R }
  }

  interface MapperWithNamespace<R> {
    <Key extends string>(namespace: string, map: Key[]): { [K in Key]: R }
    <Map extends Record<string, string>>(namespace: string, map: Map): {
      [K in keyof Map]: R
    }
  }

  type Computed = () => any

  export const mapFields: Mapper<Computed> & MapperWithNamespace<Computed>
  export const getField: any
  export const updateField: any
}
