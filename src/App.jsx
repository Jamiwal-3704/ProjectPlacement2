import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    try {
      const json = JSON.parse(input);
      const res = await axios.post('https://bhflqualifier-2.onrender.com/apibhfl', json);
      setResponse(res.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON input');
    }
  };

  const handleFilterChange = (e) => {
    const options = [...e.target.selectedOptions].map(opt => opt.value);
    setSelectedFilters(options);
  };

  const filteredResponse = () => {
    if (!response) return null;

    const filters = {
      Numbers: response.numbers,
      'Highest Alphabet': response.highest_alphabet,
    };

    return selectedFilters.reduce((acc, filter) => {
      acc[filter] = filters[filter];
      return acc;
    }, {});
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Roll Number</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Enter JSON input, e.g., {"data": ["M", "1", "334", "4", "B"]}'
        style={styles.textarea}
      />
      <button onClick={handleSubmit} style={styles.button}>Submit</button>

      {error && <p style={styles.error}>{error}</p>}

      {response && (
        <div>
          <h2 style={styles.subtitle}>Multi Filter</h2>
          <select
            multiple
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="Numbers">Numbers</option>
            <option value="Highest Alphabet">Highest Alphabet</option>
          </select>

          <h2 style={styles.subtitle}>Filtered Response</h2>
          {Object.entries(filteredResponse()).map(([key, value]) => (
            <div key={key} style={styles.responseItem}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

// Inline styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    color: '#333',
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#333',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  responseItem: {
    marginBottom: '10px',
  },
};