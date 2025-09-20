import { useState, useEffect } from 'react'
import UserCard from './components/UserCard'
import './App.css'

interface User {
  name: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User>({ name: 'John Doe', role: 'Full Stack Developer' });

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('todo-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Update user info
  const updateUser = (newName: string, newRole: string) => {
    setUser({ name: newName, role: newRole });
  };

  return (
    <UserCard 
      name={user.name} 
      role={user.role} 
      onUpdate={updateUser} 
    />
  );
}

export default App