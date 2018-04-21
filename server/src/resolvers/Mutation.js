const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


async function signup(parent, args, context, info) {

  const password = await bcrypt.hash(args.password, 10)

  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  }, `{ id }`)


  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {

  const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `)
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

function createTodo(parent, args, context, info) {
  return context.db.mutation.createTodo(
    {
      data: {
        title: args.title,
        completedAt: "0000"
      },
    },
    info,
  )
}

function markComplete(parent, args, context, info) {
  return context.db.mutation.updateTodo(
    { 
      data: {completedAt:args.completedAt}, where: {id: args.id}
    },
    info,
  )  
}



function updateTodoText(parent, args, context, info) {
  return context.db.mutation.updateTodo(
    { 
      data: {title:args.title}, where: {id: args.id}
    },
    info,
  )  
}

function deleteTodo(parent, args, context, info) {
  return context.db.mutation.deleteTodo(
    { 
      where: {id: args.id}
    },
    info,
  )  
}

module.exports = {
    signup,
    login,
    createTodo,
    updateTodoText,
    deleteTodo,
    markComplete,
}