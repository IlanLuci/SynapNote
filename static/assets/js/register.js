document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);
  
    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        // Signup successful
        window.location.href = '/dashboard'; // Redirect to the dashboard or any other page
      } else {
        const errorMessage = await response.text();
        document.getElementById('register-error').textContent = errorMessage;
        document.getElementById('register-error').style.display = "block";
      }
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  });