import { useState } from 'react';
import { store } from '../redux';
import './App.css';

function App() {
  const state = store.getState();

  const [count, setCount] = useState(state.a);

  const handleClick = () => {
    store.dispatch({ type: 'add' })
  }

  store.subscribe(() => {
    setCount(store.getState().a)
  })

  return (
    <div className="App">
      {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

export default App;
