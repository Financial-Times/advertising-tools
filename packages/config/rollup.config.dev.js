import serve from 'rollup-plugin-serve'
import config from './rollup.config'

const server = serve({ open: true, contentBase: './', port: 8080 })

export default config.map((bundle) => {
  if (Array.isArray(bundle.plugins)) {
    bundle.plugins.push(server)
  } else {
    bundle.plugins = [server]
  }

  return bundle
})
