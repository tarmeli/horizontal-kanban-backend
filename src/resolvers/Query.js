const { getUserId } = require("../utils")

const info = () => 'This is the API of a Kanban poc'

const tasks = async (root, args, context, info) => {
    return context.prisma.tasks()
}

const tasksById = async (root, args, context, info) => {
    const userId = getUserId(context);
    return context.prisma.tasks({
      where: {
        user: {
          id: userId,
        },
      },
    });
  };

module.exports = {
    info,
    tasks,
    tasksById,
}
