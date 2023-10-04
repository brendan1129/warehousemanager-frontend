import { Accordion, GridContainer, Grid, CardGroup, Card, CardMedia, CardBody, CardHeader } from '@trussworks/react-uswds'
import img from '../assets/newWarehouse.png'
import  { AccordionItemProps } from "@trussworks/react-uswds/lib/components/Accordion/Accordion";
import '../styles/HomeStyle.css'
export default function Home() {

  const accordionItem: AccordionItemProps[] = [ 
    {
      title: "Company View",
      content: "This page allows users to add and delete companies, along with providing brief descriptions of their purposes. This simplifies the organization of warehouse ownership for effective management.",
      expanded: false,
      id: "company",
      headingLevel: "h1"
    },
    {
      title: "Warehouse View",
      content: "This page enables users to create and manage warehouses. Begin by selecting a company from the dropdown menu on the left, which is populated with the information provided in the company view. Once a company is selected, you'll have access to all the associated warehouses for that specific company.",
      expanded: false,
      id: "warehouse",
      headingLevel: "h1"
    },
    {
      title: "Item View",
      content: "This page facilitates the management of warehouse contents. Start by selecting the company and its corresponding warehouse to view the current inventory. You can then add or edit item quantities. Be mindful not to exceed the maximum capacity of the selected warehouse.",
      expanded: false,
      id: "item",
      headingLevel: "h1"
    }
  ]
  return(
    <>
      <div className = "usa-section"
        style={{
          minHeight: "550px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      > 
      
      <GridContainer>
        <Grid row gap = {6}>
          <Grid tablet={{ col: true }}>
            <CardGroup style = {{borderRadius: 1, display: "contents", marginTop: ".67rem"}}>
              <Card>
                <CardHeader>
                <h3 className="text-normal"><b>Welcome</b> to your one stop shop for managing companies, warehouses, and products.</h3>
                </CardHeader>
                <CardBody>
                  <CardMedia inset={true} style={{textAlign: "center", display:"inline-block"}}>
                    <img src={img} style ={{ height: "256px", width: "256px"}}></img>
                  </CardMedia>
                </CardBody>
              </Card>
            </CardGroup>
          </Grid>
          <Grid tablet={{ col: true }}>
            <CardGroup style = {{borderRadius: 1, display: "contents", marginBottom: ".67rem"}}>
                <Card>
                  <CardHeader>
                    <h3 className="text-normal">The drop-downs below offer a brief summary of each provided service:</h3>
                  </CardHeader>
                  <CardBody style = {{marginTop: "3rem", marginBottom: "3rem"}}>
                    <Accordion multiselectable={true} bordered={true} items={accordionItem}></Accordion>
                  </CardBody>
                </Card>
            </CardGroup>
          </Grid>
        </Grid>
      </GridContainer>           
      </div>
    </>
    )
}