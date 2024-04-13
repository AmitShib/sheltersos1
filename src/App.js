import './App.css';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';
import React, { useRef } from 'react';



function App() {

  const mapRef = useRef(null); // Create a ref for the map instance

  return (
    <div className="App">
      <header className="App-header">
        <MapComponent mapRef={mapRef} />
        <ShelterList mapRef={mapRef} />
      </header>
    </div>
  );
}

export default App;
