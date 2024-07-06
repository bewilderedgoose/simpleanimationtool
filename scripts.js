const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');
const frameRateInput = document.getElementById('frame-rate');
const frameDelayInput = document.getElementById('frame-delay');
const downloadButton = document.getElementById('download-button');
const frameRateValue = document.getElementById('frame-rate-value');
const frameDelayValue = document.getElementById('frame-delay-value');

let images = [];
let currentFrame = 0;
let animationInterval = null;

fileInput.addEventListener('change', handleFileInput);
playButton.addEventListener('click', playAnimation);
stopButton.addEventListener('click', stopAnimation);
frameRateInput.addEventListener('input', updateFrameRate);
frameDelayInput.addEventListener('input', updateFrameDelay);
downloadButton.addEventListener('click', downloadAnimation);

function handleFileInput(event) {
    const files = event.target.files;
    images = [];
    currentFrame = 0;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            images.push(img);
        };
        reader.readAsDataURL(file);
    });
}

function playAnimation() {
    if (animationInterval) return;

    const frameRate = 1000 / frameRateInput.value;
    animationInterval = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (images[currentFrame]) {
            context.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height);
        }
        currentFrame = (currentFrame + 1) % images.length;
    }, frameRate);
}

function stopAnimation() {
    clearInterval(animationInterval);
    animationInterval = null;
}

function updateFrameRate() {
    frameRateValue.textContent = frameRateInput.value;
}

function updateFrameDelay() {
    frameDelayValue.textContent = frameDelayInput.value;
}

function downloadAnimation() {
    if (!images.length) return;

    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height
    });

    images.forEach(img => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        gif.addFrame(context, {copy: true, delay: parseInt(frameDelayInput.value)});
    });

    gif.on('finished', function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'animation.gif';
        link.click();
    });

    gif.render();
}
