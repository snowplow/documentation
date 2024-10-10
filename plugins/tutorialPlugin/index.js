// A JavaScript function that returns an object.
// `context` is provided by Docusaurus. Example: siteConfig can be accessed from context.

const fs = require('fs')

// `opts` is the user-defined options.
module.exports = function (context, opts) {
  return {
    name: 'docusaurus-snowplow-tutorials-plugin',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      const out = []
      fs.readdir('./tutorials', (err, files) => {
        if (err) {
          throw new Error(err)
        }

        const dirs = files.filter((file) => {
          return fs.lstatSync(`./tutorials/${file}`).isDirectory()
        })

        for (const dir of dirs) {
          if (dir === 'components' || dir === 'theme') {
            continue
          }
          const files = fs.readdirSync(`./tutorials/${dir}`)

          const tutorial = { files: [], meta: {} }
          for (const file of files) {
            if (file === 'meta.json') {
              tutorial.meta = JSON.parse(
                fs.readFileSync(`./tutorials/${dir}/${file}`, 'utf8')
              )
              tutorial.meta.id = dir
            } else {
              if (!fs.lstatSync(`./tutorials/${dir}/${file}`).isDirectory()) {
                tutorial.files.push('./' + dir + '/' + file)
              }
            }
          }
          out.push(tutorial)
        }
      })
      return out
    },

    async contentLoaded({ content, actions }) {
      // The contentLoaded hook is done after loadContent hook is done.
      // `actions` are set of functional API provided by Docusaurus (e.g. addRoute)
      const { addRoute, createData } = actions

      const contentPath = await createData(
        'tutorials.json',
        JSON.stringify(content)
      )

      addRoute({
        path: '/tutorials',
        component: '@site/src/components/tutorials/TutorialList',
        modules: {
          tutorials: contentPath,
        },
        exact: true,
      })
    },
  }
}
