import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    type: 'own',
  });
  const [editingEventId, setEditingEventId] = useState(null);

  const token = localStorage.getItem('authToken');

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data.filter(event => event.type === 'own'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await axios.put(`http://localhost:5001/api/events/${editingEventId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event updated');
      } else {
        await axios.post('http://localhost:5001/api/events', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event created');
      }
      setForm({ title: '', description: '', venue: '', date: '', type: 'own' });
      setEditingEventId(null);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving event');
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: new Date(event.date).toISOString().slice(0, 16),
      type: event.type,
    });
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5001/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event deleted');
        fetchEvents();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting event');
      }
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{editingEventId ? 'Edit Event' : 'Add New Event'}</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {editingEventId ? 'Update Event' : 'Create Event'}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event._id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <button
                onClick={() => handleEdit(event)}
                className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffDashboard;
