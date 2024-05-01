document.getElementById('getdiag').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    var form = document.getElementById('uploadForm');
    var formData = new FormData(form);

    // Send the form data to the server using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/dashboard/upload');
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Parse the response as JSON
            var response = JSON.parse(xhr.responseText);
            // Check if the 'class' field exists in the response
            if (response.class) {
                // Display the 'class' data on the page
                document.getElementById('diagnosisResult').innerText = 'Diagnosis: ' + response.class;
            } else {
                // If the 'class' field is not found, display an error message
                document.getElementById('diagnosisResult').innerText = 'Error: Class data not found in response';
            }
        } else {
            // Handle errors if any
            document.getElementById('diagnosisResult').innerText = 'Error: Predictor down, try again later!';
            console.error('Request failed. Status: ' + xhr.status);
        }
    };
    xhr.send(formData);
});


function previewFile() {
    const preview = document.getElementById('file-preview');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const img = new Image();
        img.src = reader.result;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        preview.innerHTML = '';
        preview.appendChild(img);
    }

    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        preview.innerHTML = 'No file selected';
    }
}

function sendRequest(url, imageData) {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Define a callback function to handle the response
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            document.getElementById(imageData).innerHTML = "Sent";
            console.log('Request sent successfully');
        } else {
            console.error('Failed to send request');
        }
    };

    // Send the request with the image data
    xhr.send('image=' + encodeURIComponent(imageData));
}