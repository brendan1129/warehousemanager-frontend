import { Button, Card, CardBody, CardGroup, Fieldset, Form, Grid, GridContainer, Icon, IconListItem, Label, Table, TextInput } from "@trussworks/react-uswds";
import { useAddCompanyMutation, useDeleteCompanyMutation, useGetAllCompaniesQuery } from "../api/companyApi";
import React, { useState } from "react";
import "../styles/CompanyStyle.css"
import { CompanyData } from "../api/companyApi";

export default function Company(props : { companyData: CompanyData[]}) {

    /* Hooks */
    const [ adding, setAdding ] = useState(true);

    /* RTK Query */
    const [AddCompanyMutation] = useAddCompanyMutation();
    const [DeleteCompanyMutation] = useDeleteCompanyMutation();

    /* Toggle Add Form with useState */
    const addToggle = () => {
        setAdding(!adding);
    }

    /* API call to add a new company */
    async function addSubmit(event: any) {
        event.preventDefault();
        const data = new FormData(event.target);

        if(data) {
            let description = data.get("description")!.toString()
            if(description == ""){ description = "None" }
            const newCompany = {
                companyName: data.get("name")!.toString(),
                companyDescription: description
            }
            try {
                await AddCompanyMutation(newCompany);
            } catch(error){
            console.log("something wrong with add");
            } 
        }
        addToggle();
    }

    /* Handle that delete */
    async function handleDelete(id: Number) {
        try {
         await DeleteCompanyMutation(id);
        }
        catch(error){
         console.log("something wrong with delete")
        }
    }
    /* Queries */
    //const { data, isSuccess } = useGetAllCompaniesQuery();
    
    /* Set up Table */
    let tableRows = []; // Table Array

    /* If the query for all the companies is ready, create the table array */
    if(props.companyData) {
        tableRows.push(<tbody key = {"Body"}>{props.companyData!.map((item) => (
            <React.Fragment key={String(item.company_id)}>
            <tr>
                <td className ="usa-table td">{item.companyName}</td>
                <td className ="usa-table td">{item.companyDescription}</td>
                <td className ="use-table td" style={{textAlign:"center", paddingBottom: 0}}><Button unstyled type="button" onClick={() => {handleDelete(Number(item.company_id))}} style={{color:"#000"}}><Icon.Delete size={3}></Icon.Delete></Button></td>
            </tr>
            </React.Fragment>
        ))}
        </tbody>)
        tableRows.unshift(
            <React.Fragment key={"Header"}>
            <thead>
                <tr key="tableHeader" className="usa-table th">
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{textAlign:"center"}}>Delete</th>
                </tr>
            </thead>
            </React.Fragment>
        )
    }
    /** Conditional Rendering based on useState for adding new Company  */
    return(
        <>
        <div className = "usa-section"
        style={{
          height: "550px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}> 
            <GridContainer>
                <Grid row gap={6}>
                    <Grid col={6}>
                        { adding ?
                        <>
                        <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".67rem"}}>Here are your current companies:</h2>
                        <Button type="button" onClick={addToggle} style = {{backgroundColor: "#4d8055"}}>Add Company</Button> 
                        </>
                        : 
                        <></> }
                        { adding ? <></> : 
                        <CardGroup style = {{borderRadius: 0}}>
                        <Card>
                            <CardBody>
                                <Form onSubmit={addSubmit} name= "new-company" style={{textAlign:"left"}}>
                                    <Fieldset legend="Add New Company" legendStyle="large">
                                        <Label htmlFor="name">Name</Label>
                                        <TextInput required id="new-name" type= "text" name="name"/>
                                        <Label htmlFor="description" hint=" (optional)">Description</Label>
                                        <TextInput id="new-description" type= "text" name="description"/>
                                        <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Submit</Button>
                                        <Button type="button" onClick={addToggle} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                                    </Fieldset>
                                </Form>
                            </CardBody>
                        </Card>
                        </CardGroup>
                        }
                    </Grid>
                    <Grid col={6}>
                        <Table bordered={true} fullWidth>{tableRows} </Table>
                    </Grid>
                </Grid>
            </GridContainer>
        </div>    
        </>
    )
}