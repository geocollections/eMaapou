export default ({ app }, inject) => {
  const formatDate = (isoDate) => {
    return new Date(isoDate).toISOString().split('T')[0]
  }
  inject('formatDate', formatDate)
}
