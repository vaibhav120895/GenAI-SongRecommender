document.getElementById('songForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let genre = document.getElementById('genre').value;
    let mood = document.getElementById('mood').value;

    if (!genre && !mood) {
        document.getElementById('results').innerText = "Please enter a genre, mood, or both.";
        return;
    }
    
    fetch('http://localhost:8080/api/getSongRecommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({genre: genre, mood: mood}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // Display error message
            document.getElementById('results').innerText = data.error;
        } else if (data.recommendations && Array.isArray(data.recommendations)) {
            // Display song recommendations
            let output = '';
            for(let song of data.recommendations) {
                output += `<li>${song}</li>`;
            }
            document.getElementById('results').innerHTML = output;
        } else {
            document.getElementById('results').innerText = "Unexpected server response";
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
