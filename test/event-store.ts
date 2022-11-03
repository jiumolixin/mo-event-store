import { MoEventStore } from "../src/event-store";

const store = new MoEventStore({
    state:{
        name:"123",
        friend:[1]
    }
})
 const handleState = (name:string)=>{
     console.log("name",name);
    
 }
// store.onState("name",(name:string)=>{
//     console.log(name);
// })
// store.onState("name",handleState)
// store.offState("name",handleState)
// store.state.name=1

// console.log(store.state.name)
store.onState("friend",(friend:any[])=>{
    console.log("friend",friend)
})

// store.state.friend=[...store.state.friend,1]
// console.log(store.state.friend);
store.state.friend.push(1)
