const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in

    const item = await context.db.mutation.createItem(
      {
        data: { ...args }
      },
      info
    );
    return item;
  },

  async updateItem(parent, args, context, info) {
    // First take a copy of the updates
    const updates = { ...args };
    // Remove the id from the updates
    delete updates.id;
    // run the update method
    return context.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info // this is how the update function knows what to return
    );
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };

    // 1. find the item
    const item = await context.db.query.item(
      { where },
      /* This query is 'info' and requests that these fields come back.
      Sometimes you need a second intermediary query, so the info parameter cannot be used here. 
      We are going to manually pass a query here. Raw GraphQL */
      `
      {
        id
        title
      }
    `
    );
    // 2. Check if they own that item, or have the permissions
    // TODO

    // 3. Delete it!
    return context.db.mutation.deleteItem(
      {
        where
      },
      info
    );
  }
};

module.exports = Mutations;
