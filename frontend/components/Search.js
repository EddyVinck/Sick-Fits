import React, { Component } from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

const routeToItem = item => {
  Router.push({
    pathname: `/item`,
    query: {
      id: item.id
    }
  });
};

class AutoComplete extends Component {
  initialState = {
    items: [],
    loading: false
  };
  state = {
    ...this.initialState
  };

  // Debounce so the database isn't getting a request every keypress
  onChange = debounce(async (e, apolloClient) => {
    // don't fetch new items when the user removes the value
    if (e.target.value === "") {
      this.setState({ ...this.initialState });
      return;
    }

    // Continue with the search.
    console.log("searching...");

    // Manually query apollo client
    const res = await apolloClient.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    });
    this.setState({ loading: false, items: res.data.items });
  }, 350);

  render() {
    resetIdCounter(); // fixes error
    // Warning: Prop `aria-labelledby` did not match. Server: "downshift-111-label" Client: "downshift-0-label"
    return (
      <SearchStyles>
        <Downshift
          itemToString={item => (item === null ? "" : item.title)}
          onChange={routeToItem}
          onOuterClick={() => {
            console.log("outer");
            this.props.handleSearchUsage({ isUsed: false });
          }}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {apolloClient => {
                  return (
                    <input
                      {...getInputProps({
                        type: "search",
                        placeholder: "Search for an item..",
                        id: "search",
                        className: this.state.loading ? "loading" : "",
                        onClick: () => {
                          this.props.handleSearchUsage({ isUsed: true });
                        },
                        onBlur: () => {
                          this.props.handleSearchUsage({ isUsed: false });
                        },
                        onChange: e => {
                          e.persist();
                          // Set loading here because otherwise it will show the 'no items found' message bofore the debounce is finished
                          this.setState({ loading: true });
                          this.onChange(e, apolloClient);
                        }
                      })}
                    />
                  );
                }}
              </ApolloConsumer>
              {isOpen && inputValue !== "" && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                </DropDown>
              )}
              {this.state.items.length === 0 &&
                this.state.loading === false &&
                inputValue !== "" && (
                  <DropDownItem>No items found for {inputValue}</DropDownItem>
                )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
