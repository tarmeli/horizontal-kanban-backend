const jwt = require("jsonwebtoken")
const APP_SECRET = "Kanban-is-aw3some-horizontally"

const getUserId = context => {
  const Authorization = context.request.get("Authorization")
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "")
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error("Not authenticated")
}

const authenticateUser = context => {
  try {
    const Authorization = context.request.get("Authorization")
    const token = Authorization.replace("Bearer ", "")
    jwt.verify(token, APP_SECRET)
  } catch (error) {
    throw new Error("Not authenticated")
  }
}

module.exports = {
  APP_SECRET,
  getUserId,
  authenticateUser,
}
