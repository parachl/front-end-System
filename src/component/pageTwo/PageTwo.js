import React ,{useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { showSpinner  } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory } from 'react-router-dom';


const PageTwo = () => {
    const dispathch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispathch(showSpinner());
        setTimeout(function() {
          dispathch(hideSpinner())
        }, 500);

        const result =  AuthenService.checkPermission('PageTwo', 'AED');
        
        console.log('result >>',result);
        if(!result){
            history.push("/main");
        }
      });


return (
<div className='home'>PageTwo</div>
);
} 

export default PageTwo;