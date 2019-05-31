import styled from "styled-components";

const Item = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.offWhite};
  box-shadow: ${props => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  .img-wrapper {
    width: 100%;
    height: 400px;
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    background-color: rgb(238, 238, 238);
    transition: 0.16s ease-in;
  }
  p {
    font-size: 12px;
    line-height: 2;
    font-weight: 100;
    flex-grow: 1;
    color: ${props => props.theme.secondaryLight};
    font-size: 1.5rem;
    margin: 0 0 0.2rem;
  }
  .item__details {
    padding: 1.6rem 1.8rem 1rem;
  }
  .price {
    font-size: 2.5rem;
    color: ${props => props.theme.primaryDark};
  }
  .buttonList {
    display: grid;
    width: 100%;
    border-top: 1px solid ${props => props.theme.lightgrey};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${props => props.theme.lightgrey};
    & > * {
      background: white;
      border: 2px solid white;
      font-size: 1rem;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: 0.16s ease-in;
    }
    & > *:nth-child(n + 3) {
      display: none;
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.large}) {
    > a {
      height: 100%;
    }
    .buttonList {
      display: none;
      opacity: 0;
      & > * {
        opacity: 0;
      }
      & > *:first-child() {
        border: 2px solid;
      }
    }
    .img-wrapper {
      pointer-events: none;
      &::before {
        content: "";
        transition: 0.16s ease-in;
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
      }
    }
    &:hover,
    &:focus,
    &:active {
      position: relative;
      img {
        height: 100%;
      }
      .img-wrapper::before {
        opacity: 0.45;
      }

      .item__details {
        transition: 0.16s ease-in;

        position: absolute;
        bottom: 0;
        h3 {
        }
        p {
          color: ${props => props.theme.primary};
        }
        .price {
        }
      }

      .buttonList {
        opacity: 1;
        padding: 1.4rem 2rem;
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-start;
        height: 60%;
        width: 100%;
        background: none;
        pointer-events: none;

        & > * {
          display: block;
          opacity: 1;
          pointer-events: all;
          border-radius: 4px;
        }

        > button:nth-child(-n + 1),
        > a:nth-child(-n + 1) {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 50%);
          padding: 2rem 2.2rem;
          font-size: 2rem;
          font-weight: bold;
          white-space: pre;
          &:hover {
            background-color: ${props => props.theme.secondaryLight};
            border-color: ${props => props.theme.secondaryLight};
            color: white;
          }
        }
        > button:nth-child(n + 2),
        > a:nth-child(n + 2) {
          margin-left: 1rem;
          height: auto;
          line-height: 1;
          font-weight: 300;
          opacity: 0.76;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
`;

export default Item;
