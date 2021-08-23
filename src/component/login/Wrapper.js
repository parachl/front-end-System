import styled from 'styled-components';

export const Wrapper = styled.div`
width: ${({width}) => width ? width : '500px'};
background-color: #ffffff;
border-radius: 18px;
box-shadow: 5px 5px 1px 1px #888888;
padding: 20px;
`;