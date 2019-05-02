const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  // async items(parent, args, context, info) {
  //   const items = await context.db.query.items();
  //   return items;
  // }
  // the code above can be replaced with a prisma-binding if you just want to fetch data without any authentication
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, context, info) {
    // Check if there is a current user ID
    if (!context.request.userId) {
      return null;
    }
    return context.db.query.user(
      {
        where: { id: context.request.userId }
      },
      info
    );
  },
  async users(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error(`You need to be logged in to do this.`);
    }
    // 2. Check if the user has the permissions to query all the users
    hasPermission(context.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // 3. If they do, query all the users
    const WHERE = {}; // Request _all_ users, so no where selector
    return await context.db.query.users(WHERE, info);
  }
};

module.exports = Query;
