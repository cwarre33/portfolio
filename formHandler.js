document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Debugging: Log the formObject to verify its structure
    console.log('Form Object:', formObject);

    // Convert the formObject to a JSON string
    const jsonString = JSON.stringify(formObject);

    // Debugging: Log the JSON string to verify its structure
    console.log('JSON String:', jsonString);

    fetch('https://script.google.com/macros/s/AKfycbwciUt63DwhO4rYPtgbvnx677ZYGTHht2aJWGcRYQ3Vr93t_jwLawlkHCfM1E1CLVD5/exec', { // Replace 'YOUR_NEW_WEB_APP_URL' with the new URL you copied
        method: 'POST',
        body: jsonString,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Handle success
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error
    });
});

