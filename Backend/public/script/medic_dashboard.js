function submitOpinion(imageId) {
    const selectedValue = document.getElementById('select'+imageId).value;
    const imageData = {
      disease: selectedValue,
      image: imageId
    };
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/dashboard/opinion/submit', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          document.getElementById('select'+imageId).disabled = true;
          document.getElementById('button'+imageId).disabled = true;
          document.getElementById('verify'+imageId).innerHTML = 'Verified';
          console.log('Opinion submitted successfully!');
        } else {
          // Handle error
          console.error('There was a problem submitting the opinion:', xhr.statusText);
        }
      }
    };
    xhr.send(JSON.stringify(imageData));
  }
  