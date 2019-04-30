import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Link from "next/link";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name # User
    }
  }
`;

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  };
  initialState = {
    password: "",
    confirmPassword: ""
  };
  state = {
    ...this.initialState
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        // The refetchQueries are, well, refetched after this
        // Mutation is done running
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading, called }) => {
          console.log(reset);
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const success = await reset();
                this.setState({
                  ...this.initialState
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset your password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  New password
                  <input
                    type="password"
                    name="password"
                    placeholder="New password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confirmPassword">
                  Confirm your new password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Change password</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default ResetPassword;
