'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserCreator() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userCreated, setUserCreated] = useState(false);
  
  useEffect(() => {
    const createUserInDb = async () => {
      if (isLoaded && isSignedIn && user && !userCreated) {
        try {
          const userData = {
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username || `user_${Date.now()}`,
            firstName: user.firstName || 'Unknown',
            lastName: user.lastName || 'User',
            photo: user.imageUrl
          };
          
          const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          
          if (response.ok) {
            console.log('User created in MongoDB');
            setUserCreated(true);
          } else {
            console.error('Failed to create user in MongoDB');
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    };
    
    createUserInDb();
  }, [isLoaded, isSignedIn, user, userCreated]);
  
  return null;
}