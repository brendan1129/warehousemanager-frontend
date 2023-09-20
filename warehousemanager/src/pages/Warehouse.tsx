import { useEffect, useState } from "react";
import { Company, useAddWarehouseMutation, useDeleteWarehouseMutation, useFindWarehousesByCompanyNameQuery, useGetCompanyByNameQuery, useUpdateWarehouseMutation } from "../api/companyApi";
import { Button, Card, CardGroup, Fieldset, Form, Grid, GridContainer, Icon, Label, Select, Table, TextInput } from "@trussworks/react-uswds";
import React from "react";
import '../styles/WarehouseStyle.css'
import {Warehouse, WarehouseData} from '../api/companyApi'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Warehouse(props: {companyData: Company[]}) {
  
  /* useState for tracking if there are any companies */
  const [entries, setEntries] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedCompanyID, setSelectedCompanyID] = useState<Number>(0);
  const [ adding, setAdding ] = useState(true);
  const [ editing, setEditing ] = useState(true);
  const [ editID, setEditID] = useState("");
  const [ editName, setEditName] = useState("");
  const [ editCapacity, setEditCapacity] = useState("");
  const [AddWarehouseMutation] = useAddWarehouseMutation();
  const [EditWarehouseMutation] = useUpdateWarehouseMutation();
  const [DeleteWarehouseMutation] = useDeleteWarehouseMutation();

  const addToggle = () => {
    setAdding(!adding);
  }
  async function addSubmit(e: any){
    e.preventDefault();
    const data = new FormData(e.target);

    if(data) {
      const newWarehouse = {
        warehouseName: data.get("warehouse-name")!.toString(),
        company_id: selectedCompanyID,
        maxCapacity: Number(data.get('warehouse-capacity'))
      }
      try {
        await AddWarehouseMutation(newWarehouse)
      }
      catch(error) {
        console.log("Problem Adding Warehouse");
      }
    }
    addToggle();
  }

  async function editSubmit(e: any) {
    e.preventDefault();
    const data = new FormData(e.target);

    if(data) {
      const newWarehouse = {
        warehouse_id: editID,
        warehouseName: String(data.get('edit-name')),
        maxCapacity: Number(data.get('edit-capacity')),
        company_id: selectedCompanyID
      }
      try {
        await EditWarehouseMutation({warehouseId: Number(editID), updatedWarehouse: newWarehouse})
      }
      catch (error) {
        console.log("Problem Editing Warehouse");
      }
    }
    editToggle(0, "", 0);
  }
  let name = '';
  const handleSelectChange = (e: any) => {    
    setSelected(e.target.value);
    setCompanyName(e.target.value);
    if(e.target.value == 'default') {
      setCompanyName('');
    }
  };

  const {data, isError} = useGetCompanyByNameQuery(selected);

  useEffect(() => {
    console.log("The name is: " + selected);
    if (data) {
      setSelectedCompanyID(data!.company_id);
      console.log(data.company_id);
    }
  },[data])

  useEffect(() => {
    if (props.companyData?.length == 0) {
      setEntries(false)
    }
    else if (props.companyData?.length > 0) {
      setEntries(true);
    }
  })

  const [companyName, setCompanyName] = useState('');

  const { data: warehouses, isSuccess } = useFindWarehousesByCompanyNameQuery(selected);
  
  let warehouseArray = [];

  const editToggle = (warehouse_id: Number, warehouseName: String, maxCapacity: Number) => {
      setEditing(!editing);
      if(editing) {
        setEditID(String(warehouse_id));
        setEditName(String(warehouseName));
        setEditCapacity(String(maxCapacity));
      }
      else {
        setEditID(""),
        setEditName(""),
        setEditCapacity("")
      }
  }
  if(isSuccess) {
    warehouseArray.push(<tbody key = {"Body"}>{warehouses!.map((warehouse) => (
      <React.Fragment key = {warehouse.warehouse_id.toString()}>
      <tr>
          <td className ="usa-table td" >{warehouse.warehouseName}</td>
          <td className ="usa-table td">{String(warehouse.maxCapacity)}</td>
          <td className ="usa-table td" style={{textAlign:"center"}}><Button unstyled type="button" onClick={() => editToggle(warehouse.warehouse_id, warehouse.warehouseName, warehouse.maxCapacity)} style={{color:"#000"}}><FontAwesomeIcon icon={faPenToSquare} style={{color: "#000000"}} /></Button></td>
          <td className ="use-table td" style={{textAlign:"center", paddingBottom: 0}}><Button unstyled type="button" onClick={() => {handleDelete(Number(warehouse.warehouse_id))}} style={{color:"#000"}}><Icon.Delete size={3}></Icon.Delete></Button></td>
      </tr>
      </React.Fragment>
      ))
    }
    </tbody>
    )
    warehouseArray.unshift(
    <React.Fragment key={"Header"}>
      <thead>
          <tr key="tableHeader" className="usa-table th">
              <th>Name</th>
              <th>Max Capacity</th>
              <th style={{textAlign:"center"}}>Edit</th>
              <th style={{textAlign:"center"}}>Delete</th>
          </tr>
      </thead>
    </React.Fragment>
    )
  }

  async function handleDelete(id: Number) {
    try {
      await DeleteWarehouseMutation(id);
     }
     catch(error){
      console.log("Something wrong with delete")
     }
  }

  /* Set up Selection of Companies for Add */

    return(
      <>
      <div className = "usa-section"
      style={{
        minHeight: "550px",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}>  
        <GridContainer>
          <Grid row gap={6}>
            <Grid col={6}>
            { entries ? 
              <>
              <h2 style={{textAlign:"center", margin: "0rem"}}> Select a company: </h2>
                <Select id="company-dropdown" name="company-dropdown" onChange={e => (handleSelectChange(e))} value={selected}>
                  <option value = "default">[ Select ]</option>
                  {props.companyData.map((item, index) => (
                    <React.Fragment key={index}>
                    <option value = {item.companyName}>{item.companyName}</option>
                    </React.Fragment>
                  ))}
                </Select>
                <br/>
                  { adding && editing ? <> <Button type="button" onClick={addToggle} style = {{backgroundColor: "#4d8055"}}>Add Warehouse</Button>  </> : <></> }
                  { adding ? <></> : 
                  <CardGroup style = {{borderRadius: 0, display: "contents"}}>
                  <Card >
                      <Form onSubmit={addSubmit} name= "new-warehouse" style={{textAlign:"left"}}>
                          <Fieldset legend="Add New Warehouse" legendStyle="large">
                              <Label htmlFor="name">Name</Label>
                              <TextInput required id="warehouse-name" type= "text" name="warehouse-name" />
                              <Label htmlFor="capacity" hint=" (units)">Max Capacity</Label>
                              <TextInput id="warehouse-capacity" type= "number" name="warehouse-capacity"/>
                              <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Submit</Button>
                              <Button type="button" onClick={addToggle} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                          </Fieldset>
                      </Form>
                  </Card>
                  </CardGroup>
                  } 
                  { editing ? <></> : 
                  <CardGroup style = {{borderRadius: 0, display: "contents"}}>
                  <Card >
                      <Form onSubmit={editSubmit} name= "edit-warehouse" style={{textAlign:"left"}}>
                          <Fieldset legend="Edit Warehouse" legendStyle="large">
                              <Label htmlFor="name">Name</Label>
                              <TextInput required id="edit-name" type= "text" name="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)}/>
                              <Label htmlFor="capacity" hint=" (units)">Max Capacity</Label>
                              <TextInput id="edit-capacity" type= "number" name="edit-capacity" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)}/>
                              <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Submit</Button>
                              <Button type="button" onClick={() => {editToggle(0, "", 0)}} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                          </Fieldset>
                      </Form>
                  </Card>
                  </CardGroup>
                  }
              </>
            :
            <>
            <h2> There are no Companies.</h2>
            </>
            }
            </Grid>
            <Grid col={6}>
            <h2 style={{textAlign:"center", marginTop: "0rem", marginBottom: ".5rem"}}> {companyName} Warehouses </h2>
              <Table bordered={true} fullWidth>{warehouseArray} </Table>
            </Grid>
          </Grid>
        </GridContainer>
      </div>
      </>
    )
}