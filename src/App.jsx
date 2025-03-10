import { useState ,useEffect } from "react"
import contactsServices from "./services/contactsServices"
import Notification from "./Notification"
function App() {
const [contacts , setContacts] = useState([])
const [contactDetails,setContactDetails]= useState({name:"",number:""})
const [filteredResult,setFilteredResult] = useState([])
const [statusMessage, setStatusMessage] = useState({message:'',color:''})



useEffect(()=>{
contactsServices
.getAll()
.then(response =>{
  setContacts(response)
  setFilteredResult(response)
})
},[])
const handleSearch = (e)=>{
  console.log('Hi')
 setFilteredResult(contacts.filter(contact => contact.name.includes(e.target.value)))

}
const handleInputName =(e)=>{
  setContactDetails({...contactDetails,name:e.target.value}) 
}

const handleInputNumber = (e)=>{
  setContactDetails({...contactDetails,number:e.target.value})
}

const handleAdd = ()=>{
 console.log('add')
 const newContact = {name:contactDetails.name,number:contactDetails.number}

// check if the status is modifying or adding 

 const checkPoint = contacts.filter((contact)=>contact.name === newContact.name)
 checkPoint.length === 0 ?
  contactsServices
  .create(newContact)
  .then(response =>{
    setFilteredResult([...filteredResult,response])
    setStatusMessage({message:`you have added '${response.name}'`,color:'green'})
    setTimeout(()=>
      setStatusMessage({message:'',color:''}) 
    ,3000)
    setContactDetails({name:"",number:""})
 }):
 contactsServices
 .update(checkPoint[0].id,newContact)
 .then(response =>
  setFilteredResult(filteredResult.map( result => result.id === response.id ? response : result))
 )
 setContactDetails({name:"",number:""})
 
}

const handleDelete = (contact)=>{
  contactsServices
  .deleteItem(contact.id)
  .then(response=>
    setStatusMessage({message:`the contact ${response.name} not available on server` , color:'green'})
   )
  .catch(err=> 
    setStatusMessage({message:`the contact ${contact.name} not available on server` ,color:'red'})
    )
  setTimeout(()=>
    setStatusMessage({message:'',color:''}) 
    ,3000)
  setFilteredResult(filteredResult.filter(resutl => resutl.id !== contact.id))
  
 
}
  return (
    <>
     <h1>Phonebook</h1>
     <Notification message = {statusMessage.message}  color ={statusMessage.color}/>
     <div>
     <label >filter shown with</label><input onChange={handleSearch} id='input-id' />
     </div>

     <h1>add a new</h1>

     <div>
      <label >name</label> <input value={contactDetails.name} onChange={handleInputName} type="text" placeholder="name"/>
     </div>
     <div>
      <label >number</label> <input value={contactDetails.number} onChange={handleInputNumber} type="text" placeholder="number"/>
     </div>
      <button onClick={handleAdd}>add</button>
      

     <h1>Numbers</h1>

     <ul>
     {filteredResult.map(contact=>
      <div key={contact.id} >
        <label>{contact.name}  {contact.number} </label>
        <button onClick={()=>handleDelete(contact)}>delete</button>
      </div>
     )}
     </ul>
     
     

    </>
  )
}

export default App
