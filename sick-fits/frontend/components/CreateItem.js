import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Router from "next/router";

const CREATE_ITEM_MUTATION = gql`
  # The function takes a bunch of args
  # available in createItem when prefixed with $
  # cannot use _
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/evinck/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };
  render() {
    return (
      // Mutation component is used to send the data to the GraphQL server
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(mutationFunction, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              const createItem = mutationFunction;
              // call the mutation
              const res = await createItem();
              // Send the user to the single item page
              Router.push({
                pathname: "/item",
                query: {
                  id: res.data.createItem.id
                }
              });
            }}
          >
            <h2>Sell an item.</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                  <img src={this.state.image} alt="Upload preview" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
