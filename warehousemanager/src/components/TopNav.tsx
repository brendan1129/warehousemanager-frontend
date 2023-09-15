import { Header, NavMenuButton, PrimaryNav, Title } from "@trussworks/react-uswds";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState } from "react";
import "../styles/NavbarWrapper.css"
const menuItems = [
  <a href="/" key="one" className="usa-nav__link">
    <span className="text-base-dark">Home</span>
  </a>,
   <a href="/company" key="two" className="usa-nav__link">
    <span className="text-base-dark">Companies</span>
  </a>,
  <a href="/warehouse" key="three" className="usa-nav__link">
    <span className="text-base-dark">Warehouses</span>
  </a>,
  <a href="/item" key="four" className="usa-nav__link">
    <span className="text-base-dark">Items</span>
  </a>
];
export default function TopNav() {

    const [expanded, setExpanded] = useState(false)
    const onClick = (): void => setExpanded((prvExpanded) => !prvExpanded)
    const size = useWindowSize();
    return(
      <>
        <Header basic>
          <div className="usa-nav-container">
            <div className="usa-navbar"          
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: size.width! - 30,
              maxWidth: "84rem",
              
            }}>

            <Title className="text-base-darkest"><b>Warehouse Manager</b></Title>
            <NavMenuButton onClick={onClick} label="Menu" style={{backgroundColor: "#4d8055"}}/>
            {/** 
            <NavMenuButton onClick={()=>{ window.location.replace("/")}} label="Home" />
            <NavMenuButton onClick={()=>{ window.location.replace("/company")}} label="Companies" />
            <NavMenuButton onClick={()=>{ window.location.replace("/warehouse")}} label="Warehouses" />
            <NavMenuButton onClick={()=>{ window.location.replace("/item")}} label="Items" />     
            */}
          </div>
          <PrimaryNav
              items={menuItems}
              mobileExpanded={expanded}
              onToggleMobileNav={onClick}
          >
          </PrimaryNav>  
        </div>
        </Header>
      </>
    )
}