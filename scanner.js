const videoElement = document.getElementById('video');
const overlayElement = document.getElementById('overlay');
const lastScannedElement = document.getElementById('lastScanned');

const scanner = new Instascan.Scanner({ video: videoElement });

scanner.addListener('scan', function(content) {
    const scannedData = content.split(',');
    const runnerId = scannedData[0];
    const lapCount = parseInt(scannedData[1]);

    // Update last scanned UI
    lastScannedElement.textContent = `${runnerId} - ${lapCount} laps`;

    // Update Google Sheets (you'll need to replace the URL with your Google Sheet URL)
    fetch(`https://script.google.com/macros/s/AKfycbzT4J4UKbG6i8PlFfIDluDu7Gt0VyT95GytiMg/exec?id=${runnerId}&lap=${lapCount}`)
        .then(response => response.json())
        .then(data => {
            // Notify if milestone reached
            if (data.milestoneReached) {
                alert(`Runner ${runnerId} reached a milestone of ${data.lapCount} laps!`);
            }
        })
        .catch(error => console.error('Error:', error));
});

Instascan.Camera.getCameras().then(function(cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.error('No cameras found.');
    }
}).catch(function(error) {
    console.error('Error:', error);
});
