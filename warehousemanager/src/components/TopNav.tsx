import { Header, NavMenuButton, Title } from "@trussworks/react-uswds";

export default function TopNav() {
    return(
        <Header basic={true}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>Warehouse Manager</Title>
            <NavMenuButton onClick={()=>{ window.location.replace("/")}} label="Home" />
            <NavMenuButton onClick={()=>{ window.location.replace("/company")}} label="Companies" />
            <NavMenuButton onClick={()=>{ window.location.replace("/warehouse")}} label="Warehouses" />
            <NavMenuButton onClick={()=>{ window.location.replace("/item")}} label="Items" />       
          </div>
        </div>
        </Header>
    )
}