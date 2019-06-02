const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeNiceEmail } = require("../mail");
const { hasPermission } = require("../utils");
const stripe = require("../stripe");

const Mutations = {
  async createItem(parent, args, context, info) {
    // Check if they are logged in
    if (!context.request.userId) {
      throw new Error("You must be logged in to do that.");
    }
    const hasPermissions = context.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMCREATE"].includes(permission)
    );
    if (hasPermissions === false) {
      throw new Error(`You don't have permission to create items.`);
    }

    const item = await context.db.mutation.createItem(
      {
        data: {
          // This is the way we create a relationships between an item and a user in Prisma
          user: {
            connect: {
              id: context.request.userId
            }
          },
          // Spread all the fields (image, title, price, description)
          ...args
        }
      },
      info
    );
    return item;
  },

  async updateItem(parent, args, context, info) {
    if (!context.request.userId) {
      throw new Error(`You need to be logged in to do this.`);
    }
    const isItemOwner = args.id === context.request.userId;
    const hasPermissions = context.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMUPDATE"].includes(permission)
    );
    if ((isItemOwner || hasPermissions) === false) {
      throw new Error(`You can't update this item.`);
    }

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
      info // this is how the update function knows what to return to the client
    );
  },
  async deleteItem(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error(`You need to be logged in to do this.`);
    }

    const where = { id: args.id };

    // 2. find the item
    const item = await context.db.query.item(
      { where },
      /* This query is 'info' and requests that these fields come back.
      Sometimes you need a second intermediary query, so the info parameter cannot be used here. 
      We are going to manually pass a query here. Raw GraphQL */
      `
      {
        id
        title
        user {
          id
        }
      }
    `
    );

    // 3. Check if they own that item, or have the permissions
    const isItemOwner = item.user.id === context.request.userId;
    const hasPermissions = context.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );
    if ((isItemOwner || hasPermissions) === false) {
      throw new Error(`You can't delete this item.`);
    }

    // 4. Delete it!
    return context.db.mutation.deleteItem(
      {
        where
      },
      info
    );
  },
  async signup(parent, args, context, info) {
    args.email = args.email.toLowerCase();

    // Hash their password
    const password = await bcrypt.hash(args.password, 10);

    // Create the user in the database
    const user = await context.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] } // Because permissions is reaching out to an externam enum, you have to set it like this with an array with the default permissions
        }
      },
      info
    );
    // Create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the jwt as a cookie on the response
    context.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    // Finally, return the user to the browser
    return user;
  },
  async signin(parent, args, context, info) {
    const { email, password } = args;
    // 1. Check if there is a user with that email
    const user = await context.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }
    // 3. Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // 4. Set the cookie with the token
    context.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    });
    // 5. Return the user
    return user;
  },
  signout(parent, args, context, info) {
    context.response.clearCookie("token"); // clearCookie method is provided by middleware
    return {
      message: "User successfully signed out!"
    };
  },
  async requestReset(parent, args, context, info) {
    // 1. Check if this is a real user
    const user = await context.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // 2. Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const oneHour = 3600000;
    const resetTokenExpiry = Date.now() + oneHour;
    const res = await context.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });

    // 3. Email them that reset token
    const mailResponse = await transport.sendMail({
      from: "eddy@eddyvinck.com",
      to: user.email,
      subject: "Your password reset token",
      html: makeNiceEmail(`Your password reset token is here! \n\n 
      <a href="${
        process.env.FRONTEND_URL
      }/resetpassword?resetToken=${resetToken}">Click here to reset your password.</a>`)
    });

    // 4. Return the message
    return {
      message: "Requested reset link."
    };
  },
  async resetPassword(parent, args, context, info) {
    // 1. Check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error(`Incorrect password provided`);
    }

    // 2. Check if it is a legit reset token
    // 3. Check if it is expired
    const oneHour = 3600000;
    const [user] = await context.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - oneHour // _gte means greater then or equal to
      }
    });
    if (!user) {
      throw new Error(
        `The token is invalid or expired. Try requesting a new password reset link.`
      );
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);

    // 5. Save the new password to the user
    // 6. Remove old reset token fields
    const updatedUser = await context.db.mutation.updateUser({
      where: { email: user.email },
      data: { password, resetToken: null, resetTokenExpiry: null }
    });

    // 7. Generate JWT
    const token = jwt.sign(
      {
        userId: updatedUser.id
      },
      process.env.APP_SECRET
    );

    // 8. Set the JWT cookie
    context.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    // 9. Return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error(`You need to be logged in to do this.`);
    }

    // 2. Query the current user
    const currentUser = await context.db.query.user(
      { where: { id: context.request.userId } },
      info
    );

    // 3. Check if they have the permissions to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);

    // 4. Update the permissions
    return context.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions // normally you can just pass to permissions directly, but because permissions is its own enum in graphql we need to use this `set` syntax from Prisma
          }
        },
        where: {
          id: args.userId // not the userId from context, so we can update other users too.
        }
      },
      info
    );
  },
  async addToCart(parent, args, context, info) {
    // 1. Make sure they are signed in
    const { userId } = context.request;
    if (!userId) {
      throw new Error(`You must be signed in to do this!`);
    }
    // 2. Query the users current cart
    // Using cartItems because cartItems allows us to query for a combination of userId & itemId, as opposed to cartItem (singular) which takes a CartItem ID which we don't know
    // If there is a match we can destructure the first item safely because there is never going to be multiple of the same CartItem for a user and an item. There will be only one, ever.
    const [existingCartItem] = await context.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    // 3. Check if the item is already in their cart
    if (existingCartItem) {
      // 3a. increment their current cart if it is
      return await context.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }
    // 4. If it's not, create a fresh CartItem for that user
    return await context.db.mutation.createCartItem(
      {
        data: {
          user: {
            // We need to use this connect syntax for a relationship
            connect: { id: userId }
          },
          item: {
            connect: { id: args.id }
          }
        }
      },
      info
    );
  },
  async removeFromCart(parent, args, context, info) {
    const manualQuery = `{ id, user { id }}`;
    // 1. Find the cart item
    const cartItem = await context.db.query.cartItem(
      {
        where: { id: args.id }
      },
      manualQuery // Not passing info, because we only want to grab who owns the cart item
    );
    // 1.5 Make sure we found an item
    if (!cartItem) throw new Error(`No such cart item.`);
    // 2. Make sure they own the cart item
    if (cartItem.user.id !== context.request.userId) {
      throw new Error(`You can't remove this cart item.`);
    }
    // 3. Delete that cart item
    return context.db.mutation.deleteCartItem(
      {
        where: { id: args.id }
      },
      info
    ); // Info is the query that is coming in from the client
  },
  async createOrder(parent, args, context, info) {
    // 1. Query the current user and make sure they are signed in
    const { userId } = context.request;
    if (!userId) {
      throw new Error("You must be signed in to complete this order.");
    }
    const user = await context.db.query.user(
      {
        where: { id: userId }
      },
      `{ 
        id 
        name 
        email 
        cart { 
          id 
          quantity 
          item { 
            title 
            price 
            id 
            description
            image
            largeImage 
          } 
        } 
      }`
    );
    // 2. Recalculate the total for the price
    const amount = user.cart.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );

    console.log(`Going to charge ${amount}`);
    // 3. Create the Stripe charge (turn token into $$!)
    const charge = await stripe.charges.create({
      amount,
      currency: "EUR",
      source: args.token,
      description: "order id blahblahblah123"
    });

    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        /*
        title: String!
        description: String!
        image: String!
        largeImage: String!
        price: Int!
        quantity: Int! @default(value: 1)
        user: User
       */
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: {
          connect: {
            id: userId
          }
        }
      };
      delete orderItem.id;
      return orderItem;
    });

    // 5. Create the Order
    const order = await context.db.mutation
      .createOrder({
        data: {
          total: charge.amount,
          charge: charge.id,
          items: {
            create: orderItems // This creates the orderItems and the order in _one_ request
          },
          user: { connect: { id: userId } }
        }
      })
      .catch(e => {
        throw new Error(`Processing this order has failed.`);
      });
    // 6. Clean up - clear user's cart, delete CartItems
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await context.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds
      }
    });

    // 7. Return the order to the client
    return order;
  }
};

module.exports = Mutations;
