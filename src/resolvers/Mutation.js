const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { APP_SECRET, getUserId, authenticateUser } = require("../utils")

const signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }
}

const login = async (parent, args, context, info) => {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error("No such user found")
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error("Invalid password")
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }
}

const newTask = (parent, { name, body, priority, deadline }, context) => {
    const userId = getUserId(context)
    return context.prisma.createTask({
        name,
        body,
        taskState: 1,
        priority,
        deadline,
        user: { connect: { id: userId } }
    })
}

const editTask = (parent, { name, body, priority }, context) => {
    authenticateUser(context)
    return context.prisma.updateTask({
        data: { name, body, priority, },
        where: {
            id: args.id,
        },
    })
}

const moveTask = (parent, args, context) => {
    authenticateUser(context)
    return context.prisma.updateTask({
        data: {
            taskState: args.taskState
        },
        where: {
            id: args.id
        },
    })
}

const deleteTask = (parent, args, context) => {
    authenticateUser(context)
    return context.prisma.deleteTask({
        id: args.id
    })
}

module.exports = {
    signup,
    login,
    newTask,
    editTask,
    moveTask,
    deleteTask
}
