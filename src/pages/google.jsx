import { useEffect } from 'react';
import axios from 'axios';

const GoogleCallback = () => {
  useEffect(() => {
    // Parse the authorization code or access token from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // Make an API request to your server with the authorization code or access token
    // You can use libraries like axios or fetch to make the request
    // Pass the code to your server endpoint for further processing

    // Example using axios
    axios.get(`/auth/google/callback?code=${code}`)
      .then(response => {
        // Handle the response from the server
        // e.g., store user data in state or local storage, redirect to the home page, etc.
        window.location.href = '/';
      });
  }, []);

  return (
    <div></div>
  );
};

export default GoogleCallback;
