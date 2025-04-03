import styled, { css } from "styled-components/native";

const ColorStatus = styled.View`
  border-radius: 50px;
  width: 10px;
  height: 10px;
  padding: 10px;

  ${(props) =>
    props.available &&
    css`
      background: #2ECC71;
    `}

  ${(props) =>
    props.limited &&
    css`
      background: #F1C40F;
    `}

    ${(props) =>
    props.unavailable &&
    css`
      background: #E74C3C;
    `}
`;

export default ColorStatus;