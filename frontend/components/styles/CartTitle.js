import styled from "styled-components";

const CartTitle = styled.h3`
  background: ${props => props.theme.black};
  color: white;
  display: inline-block;
  padding: 8px 12px;
  margin: 0;
  line-height: 1.4;
  font-size: 3rem;
`;

export default CartTitle;
