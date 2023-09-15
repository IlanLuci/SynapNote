document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);

    let body = {};

    for (const data of formData) {
      body[data[0]] = data[1];
    }
  
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (response.ok) {
        // login successful
        window.location.href = '/dashboard';
      } else {
        const errorMessage = await response.text();
        document.getElementById('login-error').textContent = errorMessage;
        document.getElementById('login-error').style.display = "block";
      }
    } catch (error) {
      console.error(error);
    }
  });