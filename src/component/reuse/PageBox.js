import styled from "styled-components";
import {colors} from "../../themes/style";

export const PageBox = styled.div`
  width: ${({width}) => width ? width : '1600px'};
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid ${colors.BORDER};
  box-shadow: 0 0 10px ${colors.BORDER};
  padding: 20px;
`;

export const SearchBox = styled.div`
  width: ${({width}) => width ? width : '1550px'};
  height : 100px;
  background-color: #ffffff;
  margin: 15px 0px 20px 4px;
  border-radius: 10px;
  border: 1px solid ${colors.BORDER};
  box-shadow: 0 0 10px ${colors.BORDER};
  padding: 30px 20px 20px 20px;
`;