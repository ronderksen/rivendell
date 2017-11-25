import React from 'react';

export default function Login({ onGoogleLogin }) {
  return (
    <div>
      <h1>Rivendel online</h1>
      <h2>Play Lord of the Rings: The Card Game online</h2>
      <main>
        <button onClick={onGoogleLogin}>Log in with Google</button>
      </main>
    </div>
  );
}
