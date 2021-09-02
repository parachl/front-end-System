import React,{ useState } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { NavItem } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Rilcons from 'react-icons/ri';

const SideBarLabel = styled.span`
     margin-left: 16px;
     color: #f5f5f5;
`

const SideBarLink = styled(Link)`
     display: flex;
     color: #ele9fc;
     justify-content: space=between;
     align-items:center;
     padding: 20px;
     list-style: none;
     height : 60px;
     text-decoration: none;
     font-size:18px;

     &:hover {
         background: #0064c9;
         cursor: pointer;
     }
`

const DropdownLink = styled(Link)`
      background: #007ac2 ;
      height : 60px;
      padding-left: 3rem;
      display: flex;
      align-items:center;
      text-decoration: none;
      color: #f5f5f5;
      font-size: 18px;

      &:hover {
        background: #0064c9;
        cursor: pointer;
      }
`

const Submenu = ({ item }) => {
    const [subNav, setSubNav] = useState(false);
    const showSubnav = () => setSubNav(!subNav);
    const listIcon = ['fas'];

    const list = listIcon.concat(item.icon);

    return (
        <>
          <NavItem >
              {item.listMenu && <SideBarLink onClick={item.listMenu && showSubnav} >
              <div>
                    <FontAwesomeIcon icon={list} className="mr-2" />
                    <SideBarLabel>{item.groupMenuName}</SideBarLabel>
                </div>
                <div>
                    {item.listMenu && subNav
                        ? <Rilcons.RiArrowUpSFill /> : item.listMenu
                            ? <Rilcons.RiArrowDownSFill /> : null}
                </div>
              </SideBarLink>
               }
               { !item.listMenu && <SideBarLink to={item.path} onClick={item.listMenu && showSubnav} >
              <div>
              <FontAwesomeIcon icon={list} className="mr-2" />
                    <SideBarLabel>{item.groupMenuName}</SideBarLabel>
                </div>
                <div>
                    {item.listMenu && subNav
                        ? <Rilcons.RiArrowUpSFill /> : item.listMenu
                            ? <Rilcons.RiArrowDownSFill /> : null}
                </div>
              </SideBarLink>
               }
            </NavItem>
            {subNav && item.listMenu.map((item, index) => {
                return (
                    <DropdownLink to={item.path} key={index}>
                       <FontAwesomeIcon icon={listIcon.concat(item.icon)} className="mr-2" />
                       <SideBarLabel>{item.menuName}</SideBarLabel>
                    </DropdownLink>
                )
            })}
        </>
    )
}

export default Submenu;