// src/App.js
import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import Calendar from './calendar';
import './style.css'; // Assuming your CSS is in src/
import ExpensePanel from './components/ExpenseStats';
import { fetchEvents } from './api/spending';

function App() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the date for calendar view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState(null); // For success/error messages

  // --- API Functions ---
  const updateEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  const calculateTotalExpenses = () => {
    // Check if events array is valid and not empty
    if (!events || events.length === 0) {
        return 0.00;
    }
    
    const total = events.reduce((accumulator, event) => {
        // Ensure the cost is treated as a number
        const cost = parseFloat(event.cost) || 0; 
        return accumulator + cost;
    }, 0); // Start the accumulator at 0
    
    // Format to two decimal places for currency display
    return total.toFixed(2);
  };
  
  const totalExpenses = calculateTotalExpenses();

  useEffect(() => {
    updateEvents();
  }, []);

  const handleApiAction = async (data) => {
    if (data.action === 'add') {
      try {
        const response = await fetch('http://127.0.0.1:5000/spend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage({ type: 'success', text: result.message || 'Expense added successfully!' });
          await updateEvents();
          return true;
        } else {
          setMessage({ type: 'error', text: result.message || 'Operation failed.' });
          return false;
        }
      } catch (error) {
        console.error("API error:", error);
        setMessage({ type: 'error', text: 'Network error or server issue.' });
        return false;
      }
    }
  };


  // --- Calendar Navigation ---

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + delta));
    setCurrentDate(newDate);
  };

  // --- Modal Handlers ---

  const openModal = (mode, event = null) => {
    setModalMode(mode);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setMessage(null);
  };

 
  
  
  // Use a timeout to clear messages after 5 seconds
  useEffect(() => {
    if (message) {
        const timer = setTimeout(() => setMessage(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [message]);

  // src/App.js (Only the return statement needs modification)

// ... (rest of the component logic remains the same)

  return (
    <div>
      <header>
        <h1>Budget Calendar</h1>
      </header>

      
      
      <div className="calendar-alignment-wrapper"></div>
      

      {/* Success / Error Messages */}
      {message && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

 


      {/* Main Content Container */}
      <div className="main-content-container">
        
        {/* 2. Calendar Component */}
        <Calendar
          currentDate={currentDate}
          events={events}
          changeMonth={changeMonth}
          openModal={openModal} // Pass modal handler to day cells
        />

        {/* 1. Expense Panel  */}
        <ExpensePanel         
          /* expenses={events.filter(event => event.type === 'expense')} */
          expenses={[totalExpenses]} 
        />

        
      </div>



      
      {/* Modal Component */}
      {isModalOpen && (
        <EventModal
          mode={modalMode}
          event={selectedEvent}
          closeModal={closeModal}
          handleApiAction={handleApiAction}
        />
      )}
    </div>
  );
}

export default App;
