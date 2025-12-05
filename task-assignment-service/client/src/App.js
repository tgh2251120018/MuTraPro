import React from "react";
import Sidebar from "./components/Sidebar";
import TaskBoard from "./pages/TaskBoard";
import "./styles/layout.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TaskBoard />
      </main>
    </div>
  );
}

export default App;
