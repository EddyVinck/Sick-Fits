import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const SignoutButton = props => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signoutMutation, { error, loading }) => {
      return (
        <button onClick={signoutMutation} type="button">
          {props.children}
        </button>
      );
    }}
  </Mutation>
);

export default SignoutButton;
