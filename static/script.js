document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('signatureCanvasContainer');
    var signatureCanvasCount = 0;

    var addSignatureBtn = document.getElementById('addSignatureBtn');
    var submitBtn = document.getElementById('submitBtn');

    addSignatureBtn.addEventListener('click', function() {
        var username = document.getElementById('username').value; // Get username from input field
        if (signatureCanvasCount < 10) {
            createSignatureCanvas(username);
            signatureCanvasCount++;
            if (signatureCanvasCount === 10) {
                addSignatureBtn.disabled = true;
                submitBtn.style.display = 'block'; // Show submit button
            }
        }
    });

    function createSignatureCanvas(username) {
        var canvasContainer = document.createElement('div');
        canvasContainer.className = 'signatureCanvasContainer';
        canvasContainer.style.display = 'inline-block'; // Make canvas container inline-block
        canvasContainer.style.marginRight = '10px'; // Add margin between canvases
        container.appendChild(canvasContainer);

        var canvas = document.createElement('canvas');
        canvas.className = 'signatureCanvas';
        canvas.width = 600; // Set the desired width of the canvas
        canvas.height = 300; // Set the desired height of the canvas
        canvas.style.border = '1px solid #000';
        canvasContainer.appendChild(canvas);

        var context = canvas.getContext('2d');
        var isDrawing = false;
        var lastX = 0;
        var lastY = 0;
        var startTime = null;
        var totalTime = 0;

        canvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
            startTime = Date.now();
        });

        canvas.addEventListener('mousemove', function(e) {
            if (!isDrawing) return;
            draw(e.offsetX, e.offsetY);
        });

        canvas.addEventListener('mouseup', function(e) {
            isDrawing = false;
            var endTime = Date.now();
            totalTime += endTime - startTime;
            startTime = null;
            var time = totalTime / 1000;
            var distance = Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2));
            var velocity = distance / time;
            var acceleration = velocity / time;
            console.log('Time:', time, 'Velocity:', velocity, 'Acceleration:', acceleration);
            
            // Save signature as PNG
            saveSignature(username, canvas);
        });

        canvas.addEventListener('mouseout', function() {
            isDrawing = false;
        });

        function draw(x, y) {
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.strokeStyle = '#000';
            context.lineWidth = 2;
            context.stroke();
            [lastX, lastY] = [x, y];
        }

        var clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-primary mt-2 clearCanvasBtn';
        clearBtn.textContent = 'Clear';
        clearBtn.style.display = 'block'; // Show clear button
        clearBtn.addEventListener('click', function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            totalTime = 0;
        });
        canvasContainer.appendChild(clearBtn);
    }

    function saveSignature(username, canvas) {
        var canvasData = canvas.toDataURL('image/png'); // Convert canvas to base64 data URL
        var formData = new FormData();
        formData.append('username', username);
        formData.append('signature', canvasData);

        fetch('/save-signature', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save signature');
            }
            console.log('Signature saved successfully');
        })
        .catch(error => {
            console.error(error);
        });
    }
});
