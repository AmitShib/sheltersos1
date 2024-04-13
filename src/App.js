import logo from './logo.svg';
import './App.css';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MapComponent/>
        <ShelterList/>
      </header>
    </div>
  );
}

export default App;
