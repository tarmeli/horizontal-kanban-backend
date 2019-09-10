const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { APP_SECRET, getUserId } = require("../utils")

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

const newTask = (parent, args, context) => {
    const userId = getUserId(context)
    return context.prisma.createTask({
        name: args.name,
        body: args.body,
        taskState: args.taskState,
        priority: args.priority,
        deadline: args.deadline,
        user: { connect: { id: userId } }
    })
}

const editTask = (parent, args, context) => {
    getUserId(context)
    return context.prisma.updateTask({
        data: {
            name: args.name,
            body: args.body,
            priority: args.priority,
        },
        where: {
            id: args.id,
        },
    })
}

const moveTask = (parent, args, context) => {
    getUserId(context)
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
    getUserId(context)
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
