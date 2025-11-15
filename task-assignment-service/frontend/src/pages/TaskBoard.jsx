import React, { useEffect, useState } from 'react';
import axios from '../api/taskApi';

const Column = ({title, children})=> (
  <div className="column">
    <div className="col-title">{title}</div>
    {children}
  </div>
);

const Card = ({task})=> (
  <div className="card">
    <h4>{task.task_name}</h4>
    <p>Due: {task.deadline ? new Date(task.deadline).toISOString().slice(0,10) : '—'}</p>
    <p style={{fontSize:11,marginTop:8}}>Assigned: {task.assigned_to ? task.assigned_to.join(', ') : 'Unassigned'}</p>
  </div>
);

const TaskBoard = ()=>{
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetchTasks();
  },[]);

  const fetchTasks = async ()=>{
    try{
      setLoading(true);
      const res = await axios.get('/tasks');
      setTasks(res.data || []);
    }catch(err){
      console.error(err);
      setTasks([]);
    }finally{
      setLoading(false);
    }
  };

  const byProgress = (prog)=> tasks.filter(t=> (t.progress || '').toLowerCase() === prog.toLowerCase());

  return (
    <div className="board">
      <Column title="Backlog">
        {loading ? <div className="empty">Loading...</div> : (
          tasks.filter(t=> !t.progress || t.progress.toLowerCase()==='pending').map(t=> <Card key={t.task_id} task={t} />)
        )}
      </Column>
      <Column title="Assigned">
        {loading ? <div className="empty"></div> : (
          tasks.filter(t=> (t.progress || '').toLowerCase()==='assigned').map(t=> <Card key={t.task_id} task={t} />)
        )}
      </Column>
      <Column title="In Progress">
        {loading ? <div className="empty"></div> : (
          tasks.filter(t=> (t.progress || '').toLowerCase()==='in progress').map(t=> <Card key={t.task_id} task={t} />)
        )}
      </Column>
      <Column title="Completed">
        {loading ? <div className="empty"></div> : (
          tasks.filter(t=> (t.progress || '').toLowerCase()==='completed').map(t=> <Card key={t.task_id} task={t} />)
        )}
      </Column>
    </div>
  );
};

export default TaskBoard;