import styled from 'styled-components';
import {Style} from '../../Style';

export const Container = styled.div`
background-image:linear-gradient(${Style.BACKGROUND_ONE},${Style.BACKGROUND_TWO}) ;
width: 100vw;
height: 100vh;
display: flex;
justify-content: center;
align-items: center; 
background-repeat: no-repeat;
`;