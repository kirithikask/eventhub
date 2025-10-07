import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [staffs, setStaffs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    type: 'other',
  });

  const token = localStorage.getItem('authToken');

  const fetchStaffs = async () => {
    try {
      // TODO: Implement API to fetch staff users
      // Placeholder empty array for now
      setStaffs([]);
    } catch (error) {
      console.error('Error fetching staffs:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data.filter(event => event.type === 'other'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
    fetchEvents();
  }, []);

  const handleAddStaff = async () => {
    if (!newStaffEmail) return;
    try {
      // TODO: Implement API to add staff user by email
      alert(`Staff access granted to ${newStaffEmail}`);
      setNewStaffEmail('');
      fetchStaffs();
    } catch (error) {
      alert('Error adding staff');
    }
  };

  const handleChangeNewEvent = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async () => {
    try {
      await axios.post('http://localhost:5001/api/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Other college event added');
      setNewEvent({ title: '', description: '', venue: '', date: '', type: 'other' });
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding event');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Staff Access</h2>
      <div className="mb-6">
        <input
          type="email"
          placeholder="Staff email"
          value={newStaffEmail}
          onChange={(e) => setNewStaffEmail(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddStaff}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Grant Access
        </button>
      </div>
      <ul className="mb-6">
        {staffs.length === 0 ? (
          <p>No staff access granted yet.</p>
        ) : (
          staffs.map((staff) => (
            <li key={staff._id} className="mb-2">
              {staff.email}
            </li>
          ))
        )}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Other College Events</h2>
      <div className="mb-6 max-w-md space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newEvent.title}
          onChange={handleChangeNewEvent}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleChangeNewEvent}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={newEvent.venue}
          onChange={handleChangeNewEvent}
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="date"
          value={newEvent.date}
          onChange={handleChangeNewEvent}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add Event
        </button>
      </div>

      <ul>
        {events.length === 0 ? (
          <p>No other college events found.</p>
        ) : (
          events.map(event => (
            <li key={event._id} className="border p-4 rounded shadow mb-4">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
