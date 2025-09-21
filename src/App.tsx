import { useState, useEffect } from 'react';
import UserCard from './components/UserCard';
import './App.css';

interface User {
  name: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User>({ 
    name: 'John Doe', 
    role: 'Full Stack Developer' 
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('todo-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todo-user', JSON.stringify(user));
  }, [user]);

  const updateUser = (newName: string, newRole: string) => {
    setUser({ name: newName, role: newRole });
  };

  return (
    <>
      <UserCard name={user.name} role={user.role} onUpdate={updateUser} />
    </>
  );
}

export default App;