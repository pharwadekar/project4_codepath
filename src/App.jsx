import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dogImage, setDogImage] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('affenpinscher');
  const [subBreeds, setSubBreeds] = useState([]);
  const [bannedSubBreeds, setBannedSubBreeds] = useState([]);

  const fetchDogImage = async (breed, subBreed = '') => {
    try {
      const url = subBreed 
        ? `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`
        : `https://dog.ceo/api/breed/${breed}/images/random`;
      const response = await fetch(url);
      const data = await response.json();
      setDogImage(data.message);
    } catch (error) {
      console.error('Error fetching the dog image:', error);
    }
  };

  const fetchBreeds = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      const data = await response.json();
      setBreeds(Object.keys(data.message));
    } catch (error) {
      console.error('Error fetching the breeds:', error);
    }
  };

  const fetchSubBreeds = async (breed) => {
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
      const data = await response.json();
      setSubBreeds(data.message);
    } catch (error) {
      console.error('Error fetching the sub-breeds:', error);
    }
  };

  const addToBanList = (subBreed) => {
    setBannedSubBreeds([...bannedSubBreeds, subBreed]);
  };

  const removeFromBanList = (subBreed) => {
    setBannedSubBreeds(bannedSubBreeds.filter(banned => banned !== subBreed));
  };

  const discoverNewBreed = () => {
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    setSelectedBreed(randomBreed);
  };

  useEffect(() => {
    fetchBreeds();
    fetchDogImage(selectedBreed);
    fetchSubBreeds(selectedBreed);
  }, [selectedBreed]);

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h1>Random Dog Image</h1>
        <select onChange={(e) => setSelectedBreed(e.target.value)} value={selectedBreed}>
          {breeds.map(breed => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <button className = "new-breed" onClick={discoverNewBreed}>Discover New Breed</button>
        <div>
          {subBreeds.length > 0 && <h2>Sub-breeds</h2>}
          {subBreeds.map(subBreed => (
            !bannedSubBreeds.includes(subBreed) && (
              <button key={subBreed} onClick={() => fetchDogImage(selectedBreed, subBreed)}>
                {subBreed}
              </button>
            )
          ))}
        </div>
        {dogImage ? <img src={dogImage} alt={`A random ${selectedBreed}`} /> : <p>Loading...</p>}
        <button onClick={() => fetchDogImage(selectedBreed)}>Load New Image</button>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <h2>Banned Sub-breeds</h2>
        <ul>
          {bannedSubBreeds.map(subBreed => (
            <li key={subBreed}>
              {subBreed}
              <button className="remove-button" onClick={() => removeFromBanList(subBreed)}>Remove</button>
            </li>
          ))}
        </ul>
        <h3>Add to Ban List</h3>
        {subBreeds.map(subBreed => (
          !bannedSubBreeds.includes(subBreed) && (
            <button className="ban-button" key={subBreed} onClick={() => addToBanList(subBreed)}>
              Ban {subBreed}
            </button>
          )
        ))}
      </div>
    </div>
  );
}

export default App;