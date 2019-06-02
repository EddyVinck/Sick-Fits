import styled, { css } from "styled-components";

const sharedButtonStyles = css`
  background: ${props => props.theme.primaryLight};
  color: white;
  font-weight: 500;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 2rem;
  padding: 0.8rem 1.5rem;
  display: inline-block;
  transition: all 0.5s;
  cursor: pointer;
  &[disabled] {
    cursor: not-allowed;
    cursor: wait;
    opacity: 0.5;
  }
`;

const StyledButton = styled.button`
  ${sharedButtonStyles}
`;

export default StyledButton;
export { sharedButtonStyles };
