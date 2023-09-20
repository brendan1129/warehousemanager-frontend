import { useEffect, useState } from "react";
import { Company, useFindItemsByCompanyAndWarehouseNameQuery, useFindWarehousesByCompanyNameQuery } from "../api/companyApi";
import { Button, Grid, GridContainer, Icon, Select, Table } from "@trussworks/react-uswds";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Item(props: {companyData: Company[]}) {


    const [companies, setCompanies] = useState(false);
    const [warehouses, setWarehouses] = useState(false);
    const [items, setItems] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const { data: warehouseData } = useFindWarehousesByCompanyNameQuery(selectedCompany);
    const { data: itemData } = useFindItemsByCompanyAndWarehouseNameQuery({companyName: selectedCompany, warehouseName: selectedWarehouse});

    {/** Tracking that the currently selected company has warehouses associated with it.
        Changes each time a different company is selected. */}
    useEffect(() => {
      console.log("Selected Company is: " + selectedCompany);
      if(selectedCompany== 'default') {
        setWarehouses(false);
        setSelectedWarehouse('default');
      }
      else {
        if(warehouseData) {
          if(warehouseData.length > 0) {
            setWarehouses(true);
          } else {
            setWarehouses(false);
            setSelectedWarehouse('default');
          }
        }
        else {
          setWarehouses(false);
        }
      }
    }, [selectedCompany])
    {/** Tracking that the currently selected warehouse has items associated with it.
    Changes each time a different warehouse is selected. */}
    useEffect(() => {
      console.log("Selected Warehouse is: " + selectedWarehouse);
      if(selectedWarehouse== 'default') {
        setItems(false);
      }
      else {
        if(itemData) {
          setItems(true);
        }
        else {
          setItems(false);
        }
      }
    }, [selectedWarehouse, itemData])
    
    const editToggle = (id: Number, name: String, quantity: Number) => {

    }
    const handleDelete = (id: Number) => {

    }
    let itemArray = []

    if(itemData) {
      itemArray.push(<tbody key = {"Body"}>{itemData!.map((item) => (
        <React.Fragment key = {item.item_id.toString()}>
        <tr>
            <td className ="usa-table td" >{String(item.itemName)}</td>
            <td className ="usa-table td">{String(item.quantity)}</td>
            <td className ="usa-table td" style={{textAlign:"center"}}><Button unstyled type="button" onClick={() => editToggle(item.item_id, item.itemName, item.quantity)} style={{color:"#000"}}><FontAwesomeIcon icon={faPenToSquare} style={{color: "#000000"}} /></Button></td>
            <td className ="use-table td" style={{textAlign:"center", paddingBottom: 0}}><Button unstyled type="button" onClick={() => {handleDelete(Number(item.item_id))}} style={{color:"#000"}}><Icon.Delete size={3}></Icon.Delete></Button></td>
        </tr>
        </React.Fragment>
        ))
      }
      </tbody>
      )
      itemArray.unshift(
      <React.Fragment key={"Header"}>
        <thead>
            <tr key="tableHeader" className="usa-table th">
                <th>Name</th>
                <th>Quantity</th>
                <th style={{textAlign:"center"}}>Edit</th>
                <th style={{textAlign:"center"}}>Delete</th>
            </tr>
        </thead>
      </React.Fragment>
      )
    }
    {/** Tracking that the company list is greater than 0 in length.
      If not, the appropriate message will be rendered to DOM.  */}
    useEffect(() => {
      if (props.companyData?.length == 0) {
        setCompanies(false)
      }
      else if (props.companyData?.length > 0) {
        setCompanies(true);
      }
    });

    const handleSelectChange = (e: any) => {    
      setSelectedCompany(e.target.value);
    };
    const handleWarehouseSelectChange = (e: any) => {    
      setSelectedWarehouse(e.target.value);
    };

    return(
        <>
        <div className = "usa-section"
        style={{
          height: "550px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
        >  
        <GridContainer>
          <Grid row gap={6}>
            <Grid col={6}>
            { companies ? <>
            <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".67rem"}}> Select a company: </h2>
                <Select id="company-dropdown" name="company-dropdown" onChange={e => (handleSelectChange(e))} value={selectedCompany}>
                  <option value = "default">[ Select ]</option>
                  {props.companyData.map((item, index) => (
                    <React.Fragment key={index}>
                    <option value = {item.companyName}>{item.companyName}</option>
                    </React.Fragment>
                  ))}
                </Select>
            { warehouses ? <>
            <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".67rem"}}> Select a warehouse: </h2>
                <Select id="warehouse-dropdown" name="warehouse-dropdown" onChange={e => (handleWarehouseSelectChange(e))} value={selectedWarehouse}>
                  <option value = "default">[ Select ]</option>
                  {warehouseData?.map((item, index) => (
                    <React.Fragment key={index}>
                      <option value = {String(item.warehouseName)}>{item.warehouseName}</option>
                    </React.Fragment>
                  ))}
                </Select>
            </>
            : <> <h2 style={{textAlign:"center", margin: "0rem", marginTop: ".67rem"}}> No Warehouses Available </h2> </> } 
            </>
            : <>  No Companies Available </> }
            </Grid>
            <Grid col={6}>
              {items ? <>
                <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".67rem"}}> {selectedWarehouse} Items </h2>
                <Table bordered={true} fullWidth>{itemArray} </Table>
              </> : <>

              </>}
            </Grid>
          </Grid>
        </GridContainer>
        </div>
        </>
    )
}

