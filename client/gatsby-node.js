const path = require("path")

exports.createPages = async ({ actions: { createPage } }) => {
  ;[2, 3].map(i => {
    createPage({
      path: `/add/${i}`,
      component: path.resolve("./src/components/Add.tsx"),
      context: { users: i },
      defer: false,
    })
  })
}
