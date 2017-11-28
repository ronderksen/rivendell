import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav({ isAuthenticated }) {
  console.log(isAuthenticated);
  return (
    <nav>
      <ol>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/play">Play</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        {!isAuthenticated && <li><NavLink to="/login">Login</NavLink></li>}
        {isAuthenticated && <li><NavLink to="/logout">Logout</NavLink></li>}
      </ol>
    </nav>
  );
}
