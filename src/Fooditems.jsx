*optional*
    
const FoodItems = () => {
    // let footiems=["dal","chawal","milk","cake","samosa"]
    let Footiems=[]
    return<>
    <ul class="list-group">
    {footiems.map(item =><li class="list">{item}</li>)}
   </ul>
   </>
}
export default FoodItems;
