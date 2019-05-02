import { Query } from "react-apollo";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATOR",
  "ITEMUPDATER",
  "ITEMDELETER",
  "PERMISSIONUPDATER"
];

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
                  <th>{perm}</th>
                ))}
                <th>UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <User user={user} />
              ))}
            </tbody>
          </Table>
        </>
      );
    }}
  </Query>
);

class User extends React.Component {
  render() {
    const user = this.props.user;

    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(perm => (
          <td>
            <label htmlFor={`${user.id}-permission-${perm}`}>
              <input type="checkbox" name="" id="" />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;
