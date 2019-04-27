const { forwardTo } = require("prisma-binding");

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
  }
};

module.exports = Query;
