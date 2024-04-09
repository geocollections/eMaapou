import type { LMap } from "@vue-leaflet/vue-leaflet";
import type Leaflet from "leaflet";

export interface MapState {
  map: Ref<Leaflet.Map | undefined>;
  options: Ref<any>;
  currentCenter: Ref<{ lat: number; lng: number }>;
  mapClickResponse: Ref<any>;
  [K: string]: any;
}
export function useLeafletMap({
  map,
  props,
  state,
}: {
  map: Ref<Leaflet.Map | undefined>;
  props: any;
  state: MapState;
}) {
  const settingsStore = useSettings();
  const { mapBaseLayer, isBaseLayerEstonian } = storeToRefs(settingsStore);
  const baseLayers = useBaseLayers({
    visibleLayer: mapBaseLayer.value,
  });
  const estonianOverlays = useEstonianOverlays({
    estonianBasementOverlay: props.estonianBasementOverlay,
    estonianHybridOverlay: props.estonianHybridOverlay,
    estonianBedrockOverlay: props.estonianBedrockOverlay,
  });
  const ready = () => {
    state.map.value = map.value?.mapObject;
    // @ts-expect-error
    if (props.gestureHandling)
      state.map.value?.gestureHandling.enable();
    // Setting initial base layer for detail view
    if (!props.estonianMap && isBaseLayerEstonian.value)
      mapBaseLayer.value = "CartoDB";
    if (props.estonianMap && !isBaseLayerEstonian.value)
      mapBaseLayer.value = "Estonian map";
  };

  const updateCenter = (center: { lng: number; lat: number }) => {
    state.currentCenter.value = center;
  };
  const handleBaseLayerChange = (event: Leaflet.LayersControlEvent) => {
    mapBaseLayer.value = event.name;
  };
  const handleOverlayAdd = (event: Leaflet.LayersControlEvent) => {
    if (!state.activeOverlays.value.includes(event.name))
      state.activeOverlays.value.push(event.name);
  };
  const handleOverlayRemove = (event: Leaflet.LayersControlEvent) => {
    const index = state.activeOverlays.value.indexOf(event.name);
    if (index > -1)
      state.activeOverlays.value.splice(index, 1);
  };

  return {
    ready,
    updateCenter,
    handleBaseLayerChange,
    handleOverlayAdd,
    handleOverlayRemove,
    baseLayers,
    estonianOverlays,
  };
}

export function useBaseLayers({ visibleLayer }: { visibleLayer: string }) {
  const layers = [
    {
      id: "carto-base",
      name: "CartoDB",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      visible: true,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
      },
    },
    {
      id: "open-steet-base",
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      visible: false,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
      },
    },
    {
      id: "open-topo-base",
      name: "OpenTopoMap",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      visible: false,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution:
          "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)",
      },
    },
    {
      id: "est-sat-base",
      name: "Estonian satellite",
      url: "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
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
      id: "est-map-base",
      name: "Estonian map",
      url: "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
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
  ];
  return layers.map((layer: any) => {
    return {
      ...layer,
      visible: layer.name === visibleLayer,
    };
  });
}
export function useEstonianOverlays({
  estonianHybridOverlay,
  estonianBedrockOverlay,
  estonianBasementOverlay,
}: {
  estonianHybridOverlay: boolean;
  estonianBedrockOverlay: boolean;
  estonianBasementOverlay: boolean;
}) {
  return [
    {
      id: "est-hyb-overlay",
      name: "Estonian hybrid",
      url: "https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
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
      id: "est-bed-overlay",
      isWMS: true,
      name: "Estonian bedrock",
      url: "https://gis.geocollections.info/geoserver/wms",
      layers: "geocollections:bedrock400k",
      visible: estonianBedrockOverlay,
      transparent: true,
      zIndex: 10,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution: "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 10,
      },
    },
    {
      id: "est-basement-overlay",
      isWMS: true,
      name: "Estonian basement",
      url: "https://gis.geoloogia.info/geoserver/sarv/wms",
      layers: "sarv:basement",
      visible: estonianBasementOverlay,
      transparent: true,
      zIndex: 10,
      options: {
        maxNativeZoom: 18,
        maxZoom: 21,
        attribution: "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 10,
      },
    },
  ];
}

export function useDataOverlays({
  localityOverlay = false,
  boreholeOverlay = false,
  siteOverlay = false,
  sampleOverlay = false,
  summaryOverlay = false,
}: {
  localityOverlay: boolean;
  boreholeOverlay: boolean;
  siteOverlay: boolean;
  sampleOverlay: boolean;
  summaryOverlay: boolean;
} = {
  localityOverlay: false,
  boreholeOverlay: false,
  siteOverlay: false,
  sampleOverlay: false,
  summaryOverlay: false,
}) {
  return [
    {
      id: "locs",
      isWMS: true,
      name: "Lokaliteedid / Localities",
      url: "https://gis.geocollections.info/geoserver/wms",
      layers: "sarv:locality_summary",
      styles: "point",
      visible: localityOverlay,
      transparent: true,
      zIndex: 30,
      options: {
        // maxNativeZoom: 18,
        // minZoom: 13,
        // maxZoom: 21,
        // cql_filter:
        //   'WITHIN(geom, MULTIPOLYGON(((21.372915 60.116882,21.372915 57.240421,28.235844 57.240421,21.372915 60.116882)),((28.235844 57.240421,28.235844 60.116882,21.372915 60.116882,28.235844 57.240421))))',
        attribution: "Localities: <a  href='https://geoloogia.info'>SARV</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 30,
      },
    },
    {
      id: "drillcores",
      isWMS: true,
      name: "Puursüdamikud / Drillcores",
      url: "https://gis.geocollections.info/geoserver/wms",
      layers: "sarv:locality_drillcores",
      visible: boreholeOverlay,
      transparent: true,
      zIndex: 40,
      options: {
        // maxNativeZoom: 18,
        // maxZoom: 21,
        attribution: "Boreholes: <a  href='https://geoloogia.info'>SARV</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 40,
      },
    },
    {
      id: "sites",
      isWMS: true,
      name: "Uuringupunktid / Sites",
      url: "https://gis.geocollections.info/geoserver/wms",
      layers: "sarv:site_summary",
      visible: siteOverlay,
      transparent: true,
      zIndex: 50,
      options: {
        // maxNativeZoom: 18,
        // maxZoom: 21,
        attribution: "Sites: <a  href='https://geoloogia.info'>SARV</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 50,
      },
    },
    {
      id: "samples",
      isWMS: true,
      name: "Proovid / Samples",
      url: "https://gis.geocollections.info/geoserver/wms",
      layers: "sarv:sample_summary",
      visible: sampleOverlay,
      transparent: true,
      zIndex: 50,
      options: {
        // maxNativeZoom: 18,
        // maxZoom: 21,
        attribution: "Samples: <a  href='https://geoloogia.info'>SARV</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 50,
      },
    },
    {
      id: "summary",
      isWMS: true,
      name: "Üldine / Summary",
      url: "https://gis.geocollections.info/geoserver/wms",
      layers: "sarv:locality_summary_front",
      visible: summaryOverlay,
      transparent: true,
      zIndex: 50,
      options: {
        // maxNativeZoom: 18,
        // maxZoom: 21,
        attribution: "Summary: <a  href='https://geoloogia.info'>SARV</a>",
        format: "image/png",
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
        zIndex: 50,
      },
    },
  ];
}
