import debounce from 'lodash.debounce'

export const reloadOnce = debounce(() => window.location.reload(), 100, { trailing: true })