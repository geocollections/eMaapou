import { Ref, ToRefs } from '@nuxtjs/composition-api'
import type { LMap } from 'vue2-leaflet'
import { useAccessor } from './useAccessor'
import type Leaflet from 'types/leaflet'
export interface MapState {
  map: Leaflet.Map | undefined
  [K: string]: any
}
export function useLeafletMap({
  map,
  props,
  state,
}: {
  map: Ref<LMap | undefined>
  props: any
  state: ToRefs<MapState>
}) {
  const accessor = useAccessor()
  const baseLayers = useBaseLayers({
    visibleLayer: accessor.map.getBaseLayer,
  })
  const estonianOverlays = useEstonianOverlays({
    estonianBasementOverlay: props.estonianBasementOverlay,
    estonianHybridOverlay: props.estonianHybridOverlay,
    estonianBedrockOverlay: props.estonianBedrockOverlay,
  })
  const ready = () => {
    state.map.value = map.value?.mapObject
    // @ts-ignore
    if (props.gestureHandling) state.map.value?.gestureHandling.enable()
    // Setting initial base layer for detail view
    if (!props.estonianMap && accessor.map.isBaseLayerEstonian)
      accessor.map.setBaseLayer('CartoDB')
    if (props.estonianMap && !accessor.map.isBaseLayerEstonian)
      accessor.map.setBaseLayer('Estonian map')
  }

  const updateCenter = (center: { lng: number; lat: number }) => {
    state.currentCenter.value = center
  }
  const handleBaseLayerChange = (event: Leaflet.LayersControlEvent) => {
    accessor.map.setBaseLayer(event.name)
  }
  const handleOverlayAdd = (event: Leaflet.LayersControlEvent) => {
    if (!state.activeOverlays.value.includes(event.name)) {
      state.activeOverlays.value.push(event.name)
    }
  }
  const handleOverlayRemove = (event: Leaflet.LayersControlEvent) => {
    const index = state.activeOverlays.value.indexOf(event.name)
    if (index > -1) {
      state.activeOverlays.value.splice(index, 1)
    }
  }
  return {
    ready,
    updateCenter,
    handleBaseLayerChange,
    handleOverlayAdd,
    handleOverlayRemove,
    baseLayers,
    estonianOverlays,
  }
}
const useBaseLayers = ({ visibleLayer }: { visibleLayer: string }) => {
  const layers = [
    {
      id: 'carto-base',
      name: 'CartoDB',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      visible: true,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    },
    {
      id: 'open-steet-base',
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      visible: false,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    {
      id: 'open-topo-base',
      name: 'OpenTopoMap',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      visible: false,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      },
    },
    {
      id: 'est-sat-base',
      name: 'Estonian satellite',
      url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
      visible: false,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
        tms: true,
        detectRetina: true,
        zIndex: 1,
      },
    },
    {
      id: 'est-map-base',
      name: 'Estonian map',
      url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
      visible: false,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
        tms: true,
        detectRetina: true,
        zIndex: 1,
      },
    },
  ]
  return layers.map((layer: any) => {
    return {
      ...layer,
      visible: layer.name === visibleLayer,
    }
  })
}
const useEstonianOverlays = ({
  estonianHybridOverlay,
  estonianBedrockOverlay,
  estonianBasementOverlay,
}: {
  estonianHybridOverlay: boolean
  estonianBedrockOverlay: boolean
  estonianBasementOverlay: boolean
}) => {
  return [
    {
      id: 'est-hyb-overlay',
      name: 'Estonian hybrid',
      url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
      visible: estonianHybridOverlay,
      zIndex: 20,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
        tms: true,
        detectRetina: true,
        zIndex: 20,
      },
    },
    {
      id: 'est-bed-overlay',
      isWMS: true,
      name: 'Estonian bedrock',
      url: 'https://gis.geocollections.info/geoserver/wms',
      layers: 'geocollections:bedrock400k',
      visible: estonianBedrockOverlay,
      transparent: true,
      zIndex: 10,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution: "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
        format: 'image/png',
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 10,
      },
    },
    {
      id: 'est-basement-overlay',
      isWMS: true,
      name: 'Estonian basement',
      url: 'https://gis.geoloogia.info/geoserver/sarv/wms',
      layers: 'sarv:basement',
      visible: estonianBasementOverlay,
      transparent: true,
      zIndex: 10,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution: "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
        format: 'image/png',
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 10,
      },
    },
  ]
}
