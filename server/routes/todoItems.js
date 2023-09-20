const router = require('express').Router();
//import todo model 
const todoItemsModel = require('../models/todoItems');


//create first route --add Todo Item to database
router.post('/api/item', async (req, res)=>{
  try{
    const newItem = new todoItemsModel({
      item: req.body.item
    })
    //save this item in database
    const saveItem = await newItem.save()
    res.status(200).json(saveItem);
  }catch(err){
    res.json(err);
  }
})

//create second route -- get data from database
router.get('/api/items', async (req, res)=>{
  try{
    const allTodoItems = await todoItemsModel.find({});
    res.status(200).json(allTodoItems)
  }catch(err){
    res.json(err);
  }
})


//update item
// In your Express route
// Express route to update item's selected status
// router.put('/api/item/:id', async (req, res) => {
//   try {
//     const itemId = req.params.id;
//     const { selected } = req.body;

//     // Update the selected status in the database based on itemId
//     await todoItemsModel.findByIdAndUpdate(itemId, { selected });

//     res.status(200).json('Selected status updated');
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Express route to update item's selected status and timestamp
router.put('/api/item/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { selected } = req.body;

    // Get the current item
    const item = await todoItemsModel.findById(itemId);

    // Update the selected status
    item.selected = selected;

    // If selected, update the selectedAt timestamp
    if (selected) {
      item.selectedAt = new Date();
    } else {
      item.selectedAt = null;
    }

    // Save the updated item
    await item.save();

    res.status(200).json('Selected status updated');
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.put('/api/item/:id', async (req, res)=>{
//   try{
//     //find the item by its id and update it
//     const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id, {$set: req.body});
//     res.status(200).json(updateItem);
//   }catch(err){
//     res.json(err);
//   }
// })


//Delete item from database
router.delete('/api/item/:id', async (req, res)=>{
  try{
    //find the item by its id and delete it
    const deleteItem = await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Item Deleted');
  }catch(err){
    res.json(err);
  }
})


//export router
module.exports = router;