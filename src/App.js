import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  // New state variable for tracking completion status
  const [completionStatus, setCompletionStatus] = useState({});
  // State variable to store timers for each selected item
  const [timerRefs, setTimerRefs] = useState({});

  // Function to toggle the completion status of an item
  const handleCheckboxChange = async (id) => {
    try {
      const completed = !completionStatus[id]; // Toggle the completion status

      // Send a PUT request to update the completion status and record the timestamp
      await axios.put(`http://localhost:4000/api/item/${id}`, {
        completed,
        completedAt: completed ? new Date() : null, // Record timestamp if completed, null otherwise
      });

      // Update the completion status locally in the React state
      setCompletionStatus((prevStatus) => ({
        ...prevStatus,
        [id]: completed,
      }));

      // If the checkbox is checked, select the item
      if (completed) {
        selectItem(id);
      } else {
        unselectItem(id);
      }
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/item', { item: itemText });
      setListItems((prev) => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  }

  // Function to select an item
  const selectItem = async (id) => {
    try {
      // Send a request to mark the item as selected in the backend
      await axios.put(`http://localhost:4000/api/item/${id}`, { selected: true });

      // Set a timer to automatically delete the selected item after 15 seconds
      const timer = setTimeout(() => deleteItem(id), 15000);

      // Update the item's selected status and timer reference in your React state
      setItemAsSelected(id, true, timer);
    } catch (error) {
      console.error('Error selecting item:', error);
    }
  };

  // Function to unselect an item
  const unselectItem = async (id) => {
    try {
      // Send a request to unselect the item in the backend
      await axios.put(`http://localhost:4000/api/item/${id}`, { selected: false });

      // Clear the timer (if it's still active) to prevent automatic unselection
      clearTimeout(timerRefs[id]);

      // Update the item's selected status in your React state
      setItemAsSelected(id, false);
    } catch (error) {
      console.error('Error unselecting item:', error);
    }
  };

  // Function to update the selected status and timer reference in state
  const setItemAsSelected = (id, isSelected, timer) => {
    setCompletionStatus((prevStatus) => ({
      ...prevStatus,
      [id]: isSelected,
    }));

    setTimerRefs((prevTimers) => ({
      ...prevTimers,
      [id]: timer,
    }));
  };

  // ... Rest of your code ...
    // ... Rest of your code ...
  const [itemLoading,setItemLoading]=useState(false);
  // Create function to fetch all todo items from the database -- we will use the useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      setItemLoading(true)
      try {
        const res = await axios.get('http://localhost:4000/api/items');
        setListItems(res.data);
        console.log('render');
      } catch (err) {
        console.log(err);
      }
      setItemLoading(false)
    };
    getItemsList();
  }, []);

  // Delete item when clicked on delete
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  // Update item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/item/${isUpdating}`, { item: updateItemText });
      console.log(res.data);
      const updatedItemIndex = listItems.findIndex((item) => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  };

  // Before updating item, we need to show an input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => { updateItem(e); }} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={(e) => { setUpdateItemText(e.target.value); }} value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  );

  return (
    <div className="mx-7 w-[11/12]">
      <h1 className="text-3xl font-bold mb-4 flex justify-center items-center ">Todo List</h1>
      <form className="form mb-4 flex justify-center items-center " onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          className="border rounded px-2 py-1 mr-2"
          placeholder="Add Todo Item"
          onChange={(e) => setItemText(e.target.value)}
          value={itemText}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Add
        </button>
      </form>
      <div className="todo-listItems">
      {/* {
        itemLoading?(<h1>Loading...</h1>):(

        )} */}
        {listItems.map((item) => (
          <div
            key={item._id}
            className="todo-item border rounded p-2 mb-2 flex items-center"
          >
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <p className={`item-content flex-grow ${completionStatus[item._id] ? 'completed' : ''}`}>
                  {item.item}
                </p>
                {/* Add a checkbox to indicate completion status */}
                <input
                  type="checkbox"
                  checked={completionStatus[item._id] || false}
                  onChange={() => handleCheckboxChange(item._id)}
                  className="mr-2"
                />
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  onClick={() => setIsUpdating(item._id)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;




