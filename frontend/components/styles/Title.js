import styled from "styled-components";

const Title = styled.h3`
  text-align: left;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  line-height: 1.3;
  font-size: 1.6rem;
  color: ${props => props.theme.primaryDark};
  margin: 0 0 0.5rem;
`;

export default Title;
