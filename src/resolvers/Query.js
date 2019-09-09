const info = () => 'This is the API of a Kanban poc'

const tasks = async (root, args, context, info) => {
    return context.prisma.tasks()
}

module.exports = {
    info,
    tasks
}
