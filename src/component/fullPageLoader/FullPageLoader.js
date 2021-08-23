import  React from 'react';
import { LoopCircleLoading } from 'react-loadingg';
import { useSelector } from 'react-redux';
import { Loading } from './FullPageLoader.style';


const FullPageLoader = () => {
  
    const {isShow} = useSelector((state) => state.spinner);
    return (
      isShow && <Loading>
        <div class="loader">Loading...</div>
      </Loading>
      
    );
}

export default FullPageLoader;