import { useEffect, useState } from "react";
import { Company, useAddItemMutation, useDeleteItemMutation, useFindItemsByCompanyAndWarehouseNameQuery, useFindWarehousesByCompanyNameQuery, useSellItemAndUpdateRevenueMutation, useUpdateItemMutation } from "../api/companyApi";
import { Button, Card, CardGroup, ErrorMessage, Fieldset, Form, Grid, GridContainer, Icon, Label, Select, Table, TextInput } from "@trussworks/react-uswds";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Item(props: {companyData: Company[]}) {


    {/** The following 2 hooks are for conditionally rendering company or warehouse dropdowns based on if there are any in the database */}
    const [companies, setCompanies] = useState(false);
    const [warehouses, setWarehouses] = useState(false);
    {/** The following hook is for conditionally rendering table information based on if there are any items under a warehouse */}
    const [items, setItems] = useState(false);
    {/** The following 3 hooks are for conditionally rendering forms based on if the user is editing, adding, or selling items */}
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selling, setSelling] = useState(false);
    {/** The following two hooks are for registering the state of the company and warehouse drop-downs
    Ex: If 'Company A' is selected and under that company, 'Warehouse B' is selected, then selectedCompany == 'Company A' && selectedWarehouse == 'Warehouse B' */}
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    {/** The following four hooks are for registering the state of a given items fields for populating the edit form on toggle */}
    const [id, setID] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [ppu, setPPU] = useState("");
    {/** The following RTK Query hooks are for communicating with the database. 
    1. Find warehouses associated with the selected company name. The database is designed so that there can be no duplicate company names, therefore this is safe.
    2. Find items associated with the selected company name and selected warehouse name. This prevents the situation where you have 'Company A' and 'Company B' which
    both own an identically-named warehouse called 'Warehouse A'. If either company were to query items under 'Warehouse A', they could possibly receive all 
    items associated with the name 'Warehouse A'. 
    3. Sell item hook allows the user to enter the quantity of items they would like to sell and add it to the warehouses revenue. 
      - TODO: Reduce item quantity by the amount sold
    4. useAdd, useUpdate, and useDelete for performing CRUD functions on each item  */}
    const { data: warehouseData } = useFindWarehousesByCompanyNameQuery(selectedCompany);
    const { data: itemData } = useFindItemsByCompanyAndWarehouseNameQuery({companyName: selectedCompany, warehouseName: selectedWarehouse});
    const [sellItemAndUpdateRevenue] = useSellItemAndUpdateRevenueMutation();
    const [AddItemMutation] = useAddItemMutation();
    const [EditItemMutation] = useUpdateItemMutation();
    const [DeleteItemMutation] = useDeleteItemMutation();
    {/** There's probably a better way to do this, but each hash map is used to associated the selected warehouseName with each of its own attributes, 
    be it quantity or ID */}
    const [warehouseHashMap] = useState<Map<String, Number>>(new Map<String, Number>());
    const [quantityHashMap] = useState<Map<String, Number>>(new Map<String, Number>());
    [/** The following hooks are for front-end validation and error handling */]
    const [itemCount, setItemCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("'");
    const [isError, setIsError] = useState(false);

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
          warehouseData.forEach(warehouse => {
            warehouseHashMap.set(warehouse.warehouseName, warehouse.warehouse_id);
            quantityHashMap.set(warehouse.warehouseName, warehouse.maxCapacity);
          });
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
    }, [selectedCompany, warehouseData])

    {/** Tracking that the currently selected warehouse has items associated with it.
    Changes each time a different warehouse is selected. */}
    useEffect(() => {
      console.log("Selected Warehouse is: " + selectedWarehouse);
      {/** If the warehouse is 'default' , don't render anything basically */}
      if(selectedWarehouse== 'default') {
        setItems(false);
        setItemCount(0);
      }
      else {
        setItemCount(0);
        if(itemData) {
          itemData.forEach((item) => {
            setItemCount((prev: number) => prev + Number(item.quantity));
          })
          setItems(true);
        }
        else {
          setItems(false);
          setItemCount(0);
        }
      }
    }, [selectedWarehouse, itemData])
    
    {/** For toggling the edit form on/off and setting the fields using hooks */}
    const editToggle = (id: Number, name: String, quantity: Number, price: Number) => {
      setEditing(!editing);
      if(!editing) {
        setID(String(id));
        setName(String(name));
        setQuantity(String(quantity));
        setPPU(String(price));
      }
      else {
        setID("");
        setName("");
        setQuantity("");
        setPPU(String(""))
      }
    }

    {/** For toggling the sale form on/off and setting the fields using hooks */}
    const saleToggle = (id: Number, name: String, quantity: Number, ppu: Number) => {
      setSelling(!selling);
      if(!selling) {
        setID(String(id));
        setName(String(name));
        setQuantity(String(quantity));
        setPPU(String(ppu));
        setIsError(false);
        setErrorMessage("");
      }
      else {
        setID("");
        setName("");
        setQuantity("");
        setPPU(String(ppu))
      }
    }

    {/** What happens when the user clicks submit on an edit form */}
    async function editSubmit(e: any) {
      e.preventDefault();
      const data = new FormData(e.target);
      if(data) {
        const newItem = {
          item_id: Number(id),
          itemName: String(data.get('edit-name')),
          quantity: Number(data.get('edit-quantity')),
          price: Number(data.get('edit-price')),
          warehouse_id: Number(warehouseHashMap.get(selectedWarehouse)),
        }
        if(Number(newItem.quantity) + itemCount > Number(quantityHashMap.get(selectedWarehouse))) {
          setIsError(true);
          setErrorMessage("The edited item quantity entered cannot exceed max warehouse capacity of " + quantityHashMap.get(selectedWarehouse));
        }
        else {
          setIsError(false);
          setErrorMessage("");
          try {
            await EditItemMutation({itemId: Number(id), updatedItem: newItem})
          }
          catch (error) {
            console.log("error with updating");
          }
          editToggle(0, "", 0, 0);
        }
      }
    }

    {/** What happens when the user clicks submit on the sale form */}
    async function processSale(e: any) {
      e.preventDefault();
      const data = new FormData(e.target);
      if(data) {
        const updateRevenue = {
          price: Number(data.get('sale-quantity')) * Number(ppu),
          warehouseId: Number(warehouseHashMap.get(selectedWarehouse))
        }
        console.log("The sale price is: " + updateRevenue.price);
        try {
          await sellItemAndUpdateRevenue({itemPrice: updateRevenue.price, warehouseId: updateRevenue.warehouseId})
        }
        catch (error) {
          console.log("error with sale");
        }
        saleToggle(0, "", 0, 0);
      }
    }
    {/** What happens when the user clicks the delete button */}
    async function handleDelete(id: Number) {
      try {
        await DeleteItemMutation(id)
      }
      catch (error) {
        console.log("error deleting item");
      }
    }

    {/** What happens when the user clicks submit on the add new warehouse form  */}
    async function addSubmit(e: any) {
      e.preventDefault();

      const data = new FormData(e.target);
      console.log(Number(warehouseHashMap.get(selectedWarehouse)))
      if(data) {
        {/** Obtaining warehouse_id via the warehouse hash map  */}
        const newItem = {
          itemName: data.get('item-name')!.toString(),
          quantity: Number(data.get('item-quantity')!),
          price: Number(data.get('item-price')),
          warehouse_id: Number(warehouseHashMap.get(selectedWarehouse))
        }
        {/** Front-end validation to added item quantity isn't higher than the total */}
        if(Number(newItem.quantity) + itemCount > Number(quantityHashMap.get(selectedWarehouse))) {
          setIsError(true);
          setErrorMessage("The new item quantity entered cannot exceed max warehouse capacity of " + quantityHashMap.get(selectedWarehouse));
        }
        else {
          {/** If everything is okay, try the add */}
          setErrorMessage("");
          setIsError(false);
          try {
            await AddItemMutation(newItem);
          }
          catch(error) {
            console.log("Problem Adding Warehouse");
          }
          addToggle();
        }
      }
    }
    {/** Toggle add form on/off */}
    const addToggle = () => {
      setAdding(!adding);
    }

    {/** Reactively sets up the table data for items based on what's obtained from the query using warehouse/company name */}
    let itemArray = [];
    itemArray.push(<tbody key = {"Body"}>{itemData?.map((item) => (
      <React.Fragment key = {item.item_id.toString()}>
      <tr>
          <td className ="usa-table td" >{String(item.itemName)}</td>
          <td className ="usa-table td">{String(item.quantity)}</td>
          <td className ="usa-table td">{String(item.price)}</td> {/** This is where ppu goes */}
          <td className ="usa-table td" style={{textAlign:"center"}}><Button unstyled type="button" onClick={() => editToggle(item.item_id, item.itemName, item.quantity, item.price)} style={{color:"#000"}}><FontAwesomeIcon icon={faPenToSquare} style={{color: "#000000"}} /></Button></td>
          <td className ="use-table td" style={{textAlign:"center", paddingBottom: 0}}><Button unstyled type="button" onClick={() => {handleDelete(Number(item.item_id))}} style={{color:"#000"}}><Icon.Delete size={3}></Icon.Delete></Button></td>
          <td className ="use-table td" style={{textAlign:"center", paddingBottom: 0}}><Button unstyled type="button" onClick={() => {saleToggle(Number(item.item_id), item.itemName, item.quantity, item.price)}} style={{color:"#000"}}><Icon.AttachMoney size={3}></Icon.AttachMoney></Button></td>
      </tr>
      </React.Fragment>
      ))
    }
    </tbody>
    )
    {/** Adding table headers to the top of the array, this gets passed into the USWDS <Table> component */}
    itemArray.unshift(
    <React.Fragment key={"Header"}>
      <thead>
          <tr key="tableHeader" className="usa-table th">
              <th>Name</th>
              <th>Quantity</th>
              <th>$/Unit</th>
              <th style={{textAlign:"center"}}>Edit</th>
              <th style={{textAlign:"center"}}>Delete</th>
              <th style={{textAlign:"center"}}>Sell</th>
          </tr>
      </thead>
    </React.Fragment>
    )
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

    {/** Recognizing state changes in the drop-down selectors for company/warehouse */}
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
          minHeight: "550px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
        >  
        <GridContainer>
          <Grid row gap={6}>
            <Grid tablet={{ col: true }} desktop={{col: 6}} mobile={{col: true}}>
            { companies ? <>
              <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".67rem"}}> Select a company: </h2>
                <Select style={{maxWidth: "50rem"}} id="company-dropdown" name="company-dropdown" onChange={e => (handleSelectChange(e))} value={selectedCompany}>
                  <option value = "default">[ Select ]</option>
                  {props.companyData.map((item, index) => (
                    <React.Fragment key={index}>
                    <option value = {item.companyName}>{item.companyName}</option>
                    </React.Fragment>
                  ))}
                </Select>
              { warehouses ? <>
                <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".67rem", marginTop: ".67rem"}}> Select a warehouse: </h2>
                  <Select style={{maxWidth: "50rem"}} id="warehouse-dropdown" name="warehouse-dropdown" onChange={e => (handleWarehouseSelectChange(e))} value={selectedWarehouse}>
                    <option value = "default">[ Select ]</option>
                    {warehouseData?.map((item, index) => (
                      <React.Fragment key={index}>
                        <option value = {String(item.warehouseName)}>{item.warehouseName}</option>
                      </React.Fragment>
                    ))}
                  </Select>
                  <br/>
                  { items ? <>
                    { adding ? <>
                      <CardGroup style = {{borderRadius: 0, display: "contents", marginTop: ".67rem"}}>
                      <Card >
                          <Form onSubmit={addSubmit} name= "new-item" style={{textAlign:"left"}}>
                              <Fieldset legend="Add New Item" legendStyle="large">
                                  <Label htmlFor="name">Name</Label>
                                  <TextInput required id="item-name" type= "text" name="item-name" />
                                  <Label htmlFor="quantity" hint=" (units)">Quantity</Label>
                                  <TextInput id="item-quantity" type= "number" name="item-quantity"/>
                                  <Label htmlFor="price" hint=" (per unit)">Price</Label>
                                  <TextInput id="item-price" type= "text" name="item-price"/>
                                  {!isError ? <></> : <><ErrorMessage>{errorMessage}</ErrorMessage></>}
                                  <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Submit</Button>
                                  <Button type="button" onClick={addToggle} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                              </Fieldset>
                          </Form>
                      </Card>
                      </CardGroup>
                      </> : 
                      <>
                      </>
                    }
                    { !adding && !editing && !selling ? <>
                      <Button type="button" onClick={addToggle} style = {{backgroundColor: "#4d8055", paddingBottom: ".67rem"}}>Add Item</Button></>
                      : <>
                      </>
                    }
                    { editing ? 
                    <CardGroup style = {{borderRadius: 0, display: "contents"}}>
                    <Card >
                        <Form onSubmit={editSubmit} name= "edit-item" style={{textAlign:"left"}}>
                            <Fieldset legend="Edit Item" legendStyle="large">
                                <Label htmlFor="name">Name</Label>
                                <TextInput required id="edit-name" type= "text" name="edit-name" value={name} onChange={(e) => setName(e.target.value)}/>
                                <Label htmlFor="quantity" hint=" (units)">Quantity</Label>
                                <TextInput id="edit-quantity" type= "number" name="edit-quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                                <Label htmlFor="price" hint=" (per unit)">Price</Label>
                                <TextInput id="edit-price" type= "text" name="edit-price" value={ppu} onChange={(e) => setPPU(e.target.value)}/>
                                {!isError ? <></> : <><ErrorMessage>{errorMessage}</ErrorMessage></>}
                                <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Submit</Button>
                                <Button type="button" onClick={() => {editToggle(0, "", 0, 0)}} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                            </Fieldset>
                        </Form>
                    </Card>
                    </CardGroup> : 
                    <></>
                    }
                    { selling ? 
                      <CardGroup>
                        <Card>
                          <Form onSubmit={processSale} name= 'sell-item' style= {{textAlign:"left"}}>
                            <Fieldset legend="Sell Item" legendStyle="large">
                                <Label htmlFor="sale-name">Name</Label>
                                <TextInput required id="sale-name" type= "text" name="sale-name" disabled={true} value={name}/>
                                <Label htmlFor="sale-quantity" hint=" (units)">Quantity to Sell</Label>
                                <TextInput id="sale-quantity" type= "number" name="sale-quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                                {!isError ? <></> : <><ErrorMessage>{errorMessage}</ErrorMessage></>}
                                <Button type="submit" style = {{backgroundColor: "#4d8055"}}>Process</Button>
                                <Button type="button" onClick={() => {saleToggle(0, "", 0, 0)}} style = {{backgroundColor: "#71767a"}}>Cancel</Button>
                            </Fieldset>
                          </Form>
                        </Card>
                      </CardGroup>
                      :
                      <></>
                    }
                  </> : <></>
                  }
              </>
              : <> 
              <h2 style={{textAlign:"center", margin: "0rem", marginTop: ".67rem"}}> No Warehouses Available </h2> 
              </> 
              } 
            </>
            : 
            <>
            <h2> There are no Companies.</h2>
            </> 
            }
            </Grid>
            { companies ? <>
            <Grid tablet={{ col: true }} desktop={{col: 6}} mobile={{col: true}}>
              
                <h2 style={{textAlign:"center", margin: "0rem", marginBottom: ".5rem"}}> {(selectedWarehouse !== 'default')? <>{selectedWarehouse}</> : <></>} Items </h2>
                {(selectedWarehouse !== 'default')? <>
                  <h3 style={{textAlign:"center", margin: "0rem", marginTop: ".5rem", marginBottom: "1.8rem"}}> <>Max Capacity: {quantityHashMap.get(selectedWarehouse)} | Current Capacity: {itemCount} </></h3>
                </> : 
                <></>}
                <Table bordered={true} fullWidth>{itemArray} </Table>
            </Grid>
            </> : <></>}
          </Grid>
        </GridContainer>
        </div>
        </>
    )
}

