'use client';

import { useEffect } from 'react';

const CheckoutSuccess = () => {
  console.log('CheckoutSuccess component rendered');
  
  useEffect(() => {
    console.log('CheckoutSuccess useEffect running');
    console.log('Current URL:', window.location.href);
    
    const query = new URLSearchParams(window.location.search);
    console.log('Query params:', query.toString());
    
    if (query.get('success')) {
      console.log('✅ Order placed! You will receive an email confirmation.');
      alert('Order placed successfully! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('❌ Order canceled -- continue to shop around and checkout when you\'re ready.');
      alert('Order was canceled. You can continue shopping and checkout when ready.');
    }
  }, []);
  
  return <div style={{display: 'none'}}>CheckoutSuccess loaded</div>;
};

export default CheckoutSuccess;