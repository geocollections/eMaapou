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

  inject('openWindow', openWindow)
  inject('openImage', openImage)
  inject('openGeoDetail', openGeoDetail)
}
