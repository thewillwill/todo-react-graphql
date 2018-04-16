async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { title_contains: args.filter },
        ],
      }
    : {}

  const queriedTodos = await context.db.query.todoes({
  where, skip: args.skip, first: args.first, orderBy: args.orderBy }, 
  `{ id }`,
    )
  
  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `

  const todosConnection = await context.db.query.todoesConnection({}, countSelectionSet)

  // 3
  return {
    count: todosConnection.aggregate.count,
    todoIds: queriedTodos.map(todo => todo.id),
  }
}

module.exports = {
  feed,
}