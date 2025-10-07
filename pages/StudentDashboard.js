import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventRegistration from '../components/EventRegistration';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticket, setTicket] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5001/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data.filter(event => event.status === 'upcoming' && event.type === 'own'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:5001/api/registrations/${selectedEvent._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTicket(response.data.ticketNumber);
      alert(`Registration successful. Ticket Number: ${response.data.ticketNumber}`);
      setSelectedEvent(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
      {selectedEvent ? (
        <EventRegistration event={selectedEvent} onRegister={handleRegister} />
      ) : (
        <>
          {events.length === 0 ? (
            <p>No upcoming events available.</p>
          ) : (
            <ul className="space-y-4">
              {events.map(event => (
                <li key={event._id} className="border p-4 rounded shadow">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p>{event.description}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Register
                  </button>
                </li>
              ))}
            </ul>
          )}
          {ticket && (
            <div className="mt-6 p-4 border rounded bg-green-100">
              <h3 className="text-lg font-semibold">Your Ticket</h3>
              <p>Ticket Number: {ticket}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
