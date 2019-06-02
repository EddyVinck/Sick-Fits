import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import Button from "./styles/Button";
import PropTypes from "prop-types";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATOR",
  "ITEMUPDATER",
  "ITEMDELETER",
  "PERMISSIONUPDATER"
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      console.log("test");
      if (loading) return <p>Loading...</p>;

      return (
        <>
          <Error error={error} />
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(perm => (
                  <th key={perm}>{perm}</th>
                ))}
                <th>UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <User key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </>
      );
    }}
  </Query>
);

class User extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };
  state = {
    permissions: this.props.user.permissions
  };
  handlePermissionChange = e => {
    const checkbox = e.target;
    const permission = checkbox.value;
    let updatedPermissions = [...this.state.permissions];

    if (checkbox.checked) {
      // add the permission
      updatedPermissions.push(permission);
    } else {
      updatedPermissions = updatedPermissions.filter(
        perm => perm !== permission
      );
    }
    this.setState({ permissions: updatedPermissions });
  };
  render() {
    const user = this.props.user;

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
      >
        {(updatePermissions, { loading, error }) => {
          console.log();
          return (
            <>
              {error && (
                <tr>
                  <td colSpan="8">
                    <Error error={error} />
                  </td>
                </tr>
              )}
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(perm => (
                  <td key={perm}>
                    <label htmlFor={`${user.id}-permission-${perm}`}>
                      <input
                        type="checkbox"
                        checked={this.state.permissions.includes(perm)}
                        value={perm}
                        onChange={this.handlePermissionChange}
                        name=""
                        id={`${user.id}-permission-${perm}`}
                      />
                    </label>
                  </td>
                ))}
                <td>
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={updatePermissions}
                  >
                    Updat{loading ? "ing" : "e"}
                  </Button>
                </td>
              </tr>
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default Permissions;
