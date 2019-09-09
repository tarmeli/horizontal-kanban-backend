function tasks(parent, args, context) {
    return context.prisma.user({ id: parent.id }).tasks()
}

module.exports = {
    tasks,
}
