import styled from "styled-components";
import {colors} from "../../themes/style";

export const Wrapper = styled.div`
  width: ${({width}) => width ? width : '800px'};
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid ${colors.BORDER};
  box-shadow: 0 0 10px ${colors.BORDER};
  padding: 20px;
`;
