function todos(parent, args, context, info) {
  return context.db.query.todoes({ where: { id_in: parent.todoIds } }, info)
}

module.exports = {
  todos,
}