import { Button, Card, CardGroup, Fieldset, Form, Grid, GridContainer, Icon, IconListItem, Label, Table, TextInput } from "@trussworks/react-uswds";
import { useAddCompanyMutation, useDeleteCompanyMutation, useGetAllCompaniesQuery } from "../api/companyApi";
import React, { useState } from "react";
import "../styles/CompanyStyle.css"
export default function Company() {
    /* Hooks */
    const [ editing, setEditing ] = useState(true);

    const [AddCompanyMutation] = useAddCompanyMutation();
    const [DeleteCompanyMutation] = useDeleteCompanyMutation();

    const editToggle = () => {
        setEditing(!editing);
    }

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
            console.log("something wrong");
            } 
        }
    }

    async function handleDelete(companyName: String) {
        await DeleteCompanyMutation(companyName);
    }
    /* Queries */
    const { data, isSuccess } = useGetAllCompaniesQuery();

    data?.forEach((item)=> { console.log(item.companyName)});

    
    let tableRows = []; // Table Array

    /* Set up Table */
    if(isSuccess) {
        tableRows.push(<tbody key = {"Body"}>{data!.map((item) => (
            <React.Fragment key={item.companyName}>
            <tr>
                <td className ="usa-table td">{item.companyName}</td>
                <td className ="usa-table td">{item.companyDescription}</td>
                <td className ="use-table td" style={{textAlign:"center", paddingBottom: 0}}><Button unstyled type="button" onClick={() => {handleDelete(item.companyName.toString())}} style={{color:"#000"}}><Icon.Delete size={4}></Icon.Delete></Button></td>
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
                        { editing ?
                        <>
                        <h1 style={{textAlign:"center"}}>These are the companies in the database.</h1>
                        <Button type="button" onClick={editToggle} style = {{backgroundColor: "#4d8055"}}>Add</Button> 
                        </>
                        : 
                        <></> }
                        { editing ? <></> : 
                        <CardGroup style = {{borderRadius: 0}}>
                        <Card >
                            <Form onSubmit={addSubmit} name= "new-warehouse" style={{textAlign:"left"}}>
                                <Fieldset legend="Add New Company" legendStyle="large">
                                    <Label htmlFor="name">Name</Label>
                                    <TextInput required id="new-name" type= "text" name="name"/>
                                    <Label htmlFor="description" hint=" (optional)">Description</Label>
                                    <TextInput id="new-description" type= "text" name="description"/>
                                    <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Submit</Button>
                                    <Button type="button" onClick={editToggle} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                                </Fieldset>
                            </Form>
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