import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const NotificationFeed = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setLoading(true);
        // The auth token is automatically sent by our AuthContext setup
        const { data } = await axios.get('http://localhost:5000/api/broadcasts');
        setBroadcasts(data);
      } catch (err) {
        console.error("Failed to fetch broadcasts:", err);
        setError('Could not load updates.');
      } finally {
        setLoading(false);
      }
    };

    fetchBroadcasts();
  }, []); // The empty array ensures this runs only once when the component mounts

  const renderContent = () => {
    if (loading) {
      return <p className="text-sm text-gray-500">Loading updates...</p>;
    }

    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }

    if (broadcasts.length === 0) {
      return <p className="text-sm text-gray-500">No new updates at the moment.</p>;
    }

    return (
      <ul>
        {broadcasts.map(item => (
          <li key={item._id} className="border-b border-gray-200 last:border-b-0 py-2">
            <p className="text-sm text-gray-700">{item.message}</p>
            {/* Format the timestamp from the database to be readable */}
            <p className="text-xs text-gray-500 text-right">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-48 overflow-y-auto">
      <h3 className="font-bold text-lg mb-2 text-neutral-dark">Live Updates</h3>
      {renderContent()}
    </div>
  );
};