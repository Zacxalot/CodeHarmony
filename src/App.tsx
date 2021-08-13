import React from 'react';
import Codemirror from './Components/Codemirror/Codemirror';
import CHButton from './Components/Basic UI/CHButton/CHButton';

function App() {
  return (
    <div>
      <Codemirror/>
      <CHButton text="Run"/>
    </div>
  );
}

export default App;
