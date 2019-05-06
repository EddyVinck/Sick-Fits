import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { endpoint } from "../config";
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from "../components/Cart";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include"
        },
        headers
      });
    },
    // Local data in the browser
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart: (
            _, // This parameter is unused, documentation is unclear about this
            variables,
            client
          ) => {
            const { cache } = client;
            // Read the cart open value from cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY
            });

            // Flip the cart state and write to cache
            const data = {
              data: {
                cartOpen: !cartOpen
              }
            };
            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);
