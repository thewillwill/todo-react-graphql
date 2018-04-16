function newTodoSubscribe (parent, args, context, info) {
  console.log("in newTodoSubscribe");
  return context.db.subscription.todo(
    // https://github.com/graphcool/prisma/issues/1734
    // { where: { mutation_in: ['CREATED'] } },
    { },
    info,
  )
}

const newTodo = {
  subscribe: newTodoSubscribe
}

module.exports = {
  newTodo,
}