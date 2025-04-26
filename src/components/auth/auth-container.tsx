import { useState } from 'preact/hooks';
import { Login } from './login';
import { Register } from './register';

export const AuthContainer = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? (
        <Register onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </>
  );
};