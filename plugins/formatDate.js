export default ({ app }, inject) => {
  const formatDate = (isoDate) => {
    return isoDate ? new Date(isoDate).toISOString().split('T')[0] : isoDate
  }
  inject('formatDate', formatDate)
}
