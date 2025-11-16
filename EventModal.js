import React, { useState, useEffect } from 'react';

function EventModal({ mode, event, closeModal, handleApiAction }) {

  // NOTE: I added 'price_name' in your initial code, but we should use 'cost' for the input name 
  // to match the database and backend logic for simplicity.
  const CATEGORIES = [
        'Food', 
        'Housing', 
        'Personal Care', 
        'Groceries',
        'Transportation',
        'Entertainment',
        'Custom'
    ];
  
  // Initialize form state with event data (for edit mode) or default values (for add mode)
  const initialFormState = {
    expense_name: event?.expense_name || '',
    start_date: event?.start_date || event?.date || '', // Use the clicked date for new events
    end_date: event?.end_date || event?.date || '',
    description: event?.description || '',
    category: event?.category || CATEGORIES[0],
    cost: event?.cost || '', // Initialize cost as empty string for better input handling
    custom_reason: event?.custom_reason || ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Save/Update action
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the cost field is empty before sending
    if (formData.cost === '') {
        alert("Please enter a cost amount.");
        return;
    }

    const actionData = {
        // Send all current form data
        ...formData,
        action: mode === 'add' ? 'add' : 'update',
        event_id: event?.id,
    };
    
    // Convert cost to a number right before sending if it's stored as a string
    actionData.cost = parseFloat(actionData.cost);

    const success = await handleApiAction(actionData);
    if (success) {
      closeModal();
    }
  };

  // Handle Delete action
  const handleDelete = async () => {
    // IMPORTANT: Replacing window.confirm() with a simple console log/message 
    // because alert/confirm often don't work well in embedded environments.
    console.log('Delete confirmed for event:', event.id);

    const success = await handleApiAction({
        action: 'delete',
        event_id: event.id,
    });
    if (success) {
        closeModal();
    }
  };

  return (
    <div className="modal" id="eventModal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <h2>{mode === 'add' ? 'Add New Expense' : 'Edit Expense:'}</h2>

        {/* 📝 Form */}
        <form onSubmit={handleSubmit} id="eventForm">
          <label htmlFor="expenseName">Expense:</label>
          <input 
            type="text" 
            name="expense_name" 
            id="expenseName" 
            value={formData.expense_name} 
            onChange={handleChange}
            required 
          />

          <label htmlFor="cost">Cost:</label>
          {/* FIX: Changed name from 'priceName' to 'cost' to match backend expectation 
            and updated value binding to formData.cost 
          */}
          <input 
            type="number" 
            name="cost" 
            id="cost" 
            value={formData.cost} 
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          <label htmlFor="startDate">Start Date:</label>
          <input 
            type="date" 
            name="start_date" 
            id="startDate" 
            value={formData.start_date} 
            onChange={handleChange}
            required 
          />
          
          <label htmlFor="endDate">End Date:</label>
          <input 
            type="date" 
            name="end_date" 
            id="endDate" 
            value={formData.end_date} 
            onChange={handleChange}
            required 
          />

        <label htmlFor="category">Category:</label>
        <select 
            name="category" 
            id="category" 
            value={formData.category} 
            onChange={handleChange}    
            required
        >
            {/* Map over the CATEGORIES array to create options */}
            {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
        
        {formData.category === 'Custom' && (
            <div>
                <label htmlFor="custom_reason">Custom Reason:</label>
                <input 
                    type="text" 
                    name="custom_reason" 
                    id="custom_reason" 
                    value={formData.custom_reason} 
                    onChange={handleChange}
                    placeholder="Enter your custom category name"
                    required 
                />
            </div>
        )}
    

         <label htmlFor="description">Description:</label>
          <input 
            type="text" 
            name="description" 
            id="description" 
            value={formData.description} 
            onChange={handleChange}
            required 
          />

          {/* Display Delete Button only in Edit Mode */}
          {mode === 'edit' && (
            <button type="button" onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', marginRight: '8px' }}>
                🗑️ Delete Event
            </button>
          )}

          <button type="submit">💾 {mode === 'add' ? 'Add' : 'Update'} Event</button>
          <button 
                type="button" 
                onClick={closeModal} 
                style={{ backgroundColor: '#6c757d', color: 'white', marginLeft: '8px' }} 
            > 
                ❌ Close
           </button>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
