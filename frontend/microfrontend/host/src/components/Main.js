import React, { lazy } from 'react';

// Импорт компонентов из микрофронтенда profile
const Profile = lazy(() => import('profile/Profile').catch(() => {
  return { default: () => <div className='error'>Component Profile is not available!</div> };
 }));

// Импорт компонентов из микрофронтенда place
const Places = lazy(() => import('place/Places').catch(() => {
  return { default: () => <div className='error'>Component Places is not available!</div> };
 })); 

function Main() {  
  return (
    <main className="content">
      <Profile />
      <Places />
    </main>
  );
}

export default Main;
