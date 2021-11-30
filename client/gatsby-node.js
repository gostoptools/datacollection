const path = require("path")

exports.createPages = async ({ actions: { createPage } }) => {
  for (let i = 2; i <= 6; i++) {
    createPage({
      path: `/add/${i}`,
      component: path.resolve("./src/components/Add.tsx"),
      context: { users: i },
      defer: false,
    })
  }
}
