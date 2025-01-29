"use client"
import styled from "styled-components"
import NavBarMobile from "./MobileNavbar";
import SideBar from "./SideBar";
import Container from "./Container";
import TabLayoutContainer from "./TabLayoutContainer";

const MainContainer = styled.div`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;


    @media screen and (min-width: 1200px) {
        && > ${NavBarMobile} {
            display: none;
        }
    }

     @media screen and (max-width: 1200px) {
        && > ${Container} > ${SideBar} {
            display: none;
        }
        
        && > ${Container} > ${TabLayoutContainer} {
            margin: 0;
            margin-top: 30px;
        }
     }
`;

export default MainContainer;