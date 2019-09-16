const { getUserId } = require("../utils")

const info = () => 'This is the API of a Kanban poc'

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
    tasksById,
}
