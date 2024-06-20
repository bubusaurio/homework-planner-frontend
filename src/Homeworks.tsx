import React, { useState, useEffect } from 'react';
import './Homeworks.css';

const Homeworks = () => {
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [newHomework, setNewHomework] = useState({
    name: '',
    description: '',
    status: 'In process'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const userInStorageString = window.localStorage.getItem("user");
      if (!userInStorageString) {
        throw new Error('User is not logged in');
      }

      const user = JSON.parse(userInStorageString);
      const response = await fetch(`http://localhost:3010/api/v1/homeworks/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch homeworks');
      }

      const data = await response.json();
      setHomeworks(data);
    } catch (error:any) {
      console.error('Error fetching homeworks:', error);
      setError(error.message || 'Error fetching homeworks');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHomework({
      ...newHomework,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddHomework = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const userInStorageString = window.localStorage.getItem("user");
      if (!userInStorageString) {
        throw new Error('User is not logged in');
      }

      const user = JSON.parse(userInStorageString);
      const response = await fetch('http://localhost:3010/api/v1/homeworks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newHomework),
      });

      if (!response.ok) {
        throw new Error('Failed to add homework');
      }

      // Clear the form and fetch updated homeworks
      setNewHomework({ name: '', description: '', status: 'In process' });
      fetchHomeworks();
    } catch (error:any) {
      console.error('Error adding homework:', error);
      setError(error.message || 'Error adding homework');
    }
  };

  const handleChangeStatus = async (id: string) => {
    try {
      const userInStorageString = window.localStorage.getItem("user");
      if (!userInStorageString) {
        throw new Error('User is not logged in');
      }

      const user = JSON.parse(userInStorageString);
      const response = await fetch(`http://localhost:3010/api/v1/homeworks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: 'Done' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update homework status');
      }

      fetchHomeworks();
    } catch (error:any) {
      console.error('Error updating homework status:', error);
      setError(error.message || 'Error updating homework status');
    }
  };

  return (
    <div className="homeworks-container">
      <h2>Homeworks</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddHomework}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newHomework.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={newHomework.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Homework</button>
      </form>
      <div className="homework-list">
        <h3>Current Homeworks:</h3>
        <ul>
          {homeworks.map((hw, index) => (
            <li key={index}>
              <strong>{hw.name}</strong>: {hw.description}: {hw.status}
              <button onClick={() => handleChangeStatus(hw._id)}>Mark as Done</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Homeworks;
