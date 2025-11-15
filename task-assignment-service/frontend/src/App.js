import React from 'react';
import TaskBoard from './pages/TaskBoard';
import Sidebar from './components/Sidebar';

function App(){
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <div className="header">Task Board</div>
        <TaskBoard />
      </div>
    </div>
  );
}

export default App;