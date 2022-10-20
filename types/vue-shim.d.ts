/* eslint-disable */
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { accessorType } from '~/store'
import services from '~/services'
import { ITranslations } from '~/plugins/translate'
import { Route } from 'vue-router'
import * as L from 'leaflet'
declare module '*.vue' {
  export default Vue
}
declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $L: typeof L
    $formatDate(isoDate: string): string
    $getAPIFieldValues(headers: { byIds: object; allIds: string[] }): object
    $services: ReturnType<typeof services>
    $translate(translations: ITranslations): string
    $hydrateTab(
      tab: object,
      options?: { props: {}; countParams: {} }
    ): Promise<object>
    $validateTabRoute(route: Route, tabs: object[]): Route
    $getMaxTab(route: Route, tabs: object[]): Route | undefined
    $createSlugRoute(route: Route, text: string): Route | undefined
    $openWindow(url: string): void
    $openNuxtWindow(route: string, params?: object): void
    $openImage(filename: string, size?: string): void
    $openEdit(table: string, id: string): void
    $openDeposit(id: string): void
    $openEelis(id: string): void
    $openEgf(id: string): void
    $openTurba(table: string, id: string, openNewWindow?: boolean): void
    $openGeology(table: string, id: string): void
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $formatDate(isoDate: string): string
    $getAPIFieldValues(headers: { byIds: object; allIds: string[] }): object
    $services: ReturnType<typeof services>
    $translate(translations: ITranslations): string
    $hydrateTab(
      tab: object,
      options?: { props: {}; countParams: {} }
    ): Promise<object>
    $validateTabRoute(route: Route, tabs: object[]): Route
    $getMaxTab(route: Route, tabs: object[]): Route | undefined
    $createSlugRoute(route: Route, text: string): Route | undefined
    $openWindow(url: string): void
    $openNuxtWindow(route: string, params?: object): void
    $openImage(filename: string, size?: string): void
    $openEdit(table: string, id: string): void
    $openDeposit(id: string): void
    $openEelis(id: string): void
    $openEgf(id: string): void
    $openTurba(table: string, id: string, openNewWindow?: boolean): void
    $openGeology(table: string, id: string): void
  }

  interface Context {
    $accessor: typeof accessorType
    $formatDate(isoDate: string): string
    $getAPIFieldValues(headers: { byIds: object; allIds: string[] }): object
    $services: ReturnType<typeof services>
    $translate(translations: ITranslations): string
    $hydrateTab(
      tab: object,
      options?: { props: {}; countParams: {} }
    ): Promise<object>
    $validateTabRoute(route: Route, tabs: object[]): Route
    $getMaxTab(route: Route, tabs: object[]): Route | undefined
    $createSlugRoute(route: Route, text: string): Route | undefined
    $openWindow(url: string): void
    $openNuxtWindow(route: string, params?: object): void
    $openImage(filename: string, size?: string): void
    $openEdit(table: string, id: string): void
    $openDeposit(id: string): void
    $openEelis(id: string): void
    $openEgf(id: string): void
    $openTurba(table: string, id: string, openNewWindow?: boolean): void
    $openGeology(table: string, id: string): void
  }
}
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    head?: MetaInfo | (() => MetaInfo)
  }
}
