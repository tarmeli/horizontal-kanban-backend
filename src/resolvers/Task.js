function user(parent, args, context) {
    return context.prisma.task({ id: parent.id }).user()
}

module.exports = {
    user
}
