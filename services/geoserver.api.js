const GEOSERVER_URL_WMS =
  'https://gis.geocollections.info/geoserver/sarv/wms?' +
  'SERVICE=WMS' +
  '&VERSION=1.1.1' +
  '&REQUEST=GetFeatureInfo' +
  '&FEATURE_COUNT=25' +
  '&X=50' +
  '&Y=50' +
  '&SRS=EPSG:4326' +
  '&STYLES=' +
  '&WIDTH=101' +
  '&HEIGHT=101' +
  '&exceptions=text/javascript' +
  '&INFO_FORMAT=application/json'

export default ($axios) => ({
  async getWMSData(params) {
    const response = await $axios.$get(`${GEOSERVER_URL_WMS}`, { params })

    return {
      features: response.features,
    }
  },
})
