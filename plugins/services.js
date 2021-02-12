import generateServices from '~/services'

export default (context, inject) => {
  inject('services', generateServices(context))
}
