const EDIT_URL = 'https://edit.geocollections.info'
const DEPOSIT_URL =
  'https://xgis.maaamet.ee/xGIS/bronx/maardlad/showdata.aspx?registrikaart='
const EELIS_URL = 'http://register.keskkonnainfo.ee/envreg/main?reg_kood='
const TURBA_URL = 'https://turba.geoloogia.info'
const EGF_URL = 'https://fond.egt.ee/fond/egf/'
const GEOLOGY_URL = 'https://geoloogia.info'

export default ({ app }, inject) => {
  const openWindow = (url) => {
    window.open(url, '_blank', 'height=800, width=800')
  }

  const openGeoDetail = (table, id) => {
    if (table && id) {
      window.open(
        `https://geocollections.info/${table}/${id}`,
        '_blank',
        'height=800, width=800'
      )
    }
  }

  const openNuxtWindow = (route, params = null) => {
    const routeData = app.router.resolve({
      name: `${route}___${app.i18n.locale}`,
      params,
    })
    window.open(routeData.href, '_blank', 'height=800, width=800')
  }

  const openImage = (filename, size = 'large') => {
    if (filename && size) {
      if (size === 'original') {
        window.open(
          `https://files.geocollections.info/${filename}`,
          'ImageWindow'
        )
      } else {
        window.open(
          `https://files.geocollections.info/${size}/${filename}`,
          'ImageWindow'
        )
      }
    }
  }

  const openEdit = (table, id) => {
    if (table && id) {
      if (table === 'file') table = 'attachment'
      window.open(
        `${EDIT_URL}/${table}/${id}`,
        'EditWindow',
        'height=800, width=800'
      )
    }
  }

  const openDeposit = (id) => {
    if (id) {
      window.open(
        `${DEPOSIT_URL}${id}`,
        'DepositWindow',
        'height=800, width=800'
      )
    }
  }

  const openEelis = (id) => {
    if (id) {
      window.open(`${EELIS_URL}${id}`, 'EelisWindow', 'height=800, width=800')
    }
  }

  const openEgf = (id) => {
    if (id) {
      window.open(`${EGF_URL}${id}`, 'EgfWindow', 'height=800, width=800')
    }
  }

  const openTurba = (table, id, openNewWindow = true) => {
    if (table && id) {
      window.open(
        `${TURBA_URL}/${table}/${id}`,
        openNewWindow ? 'TurbaWindow' : '_parent',
        'height=800, width=800'
      )
    }
  }

  const openGeology = (table, id) => {
    if (table && id) {
      window.open(
        `${GEOLOGY_URL}/${table}/${id}`,
        'GeologyWindow',
        'height=800, width=800'
      )
    }
  }

  inject('openGeology', openGeology)
  inject('openTurba', openTurba)
  inject('openEgf', openEgf)
  inject('openEelis', openEelis)
  inject('openDeposit', openDeposit)
  inject('openEdit', openEdit)
  inject('openWindow', openWindow)
  inject('openNuxtWindow', openNuxtWindow)
  inject('openImage', openImage)
  inject('openGeoDetail', openGeoDetail)
}
