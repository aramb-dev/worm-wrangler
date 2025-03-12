document.addEventListener('DOMContentLoaded', () => {
    const gloveImages = document.querySelectorAll('.glove-image');
    let selectedGlove = localStorage.getItem('selectedGlove') || '1';

    // Function to update selected glove appearance
    const updateGloveSelection = (gloveNumber) => {
        gloveImages.forEach(glove => {
            if (glove.dataset.glove === gloveNumber) {
                glove.classList.add('bg-blue-200', 'ring-2', 'ring-blue-500');
                glove.classList.remove('bg-gray-200');
            } else {
                glove.classList.remove('bg-blue-200', 'ring-2', 'ring-blue-500');
                glove.classList.add('bg-gray-200');
            }
        });
    };

    // Set initial selection
    updateGloveSelection(selectedGlove);

    // Add click handlers to gloves
    gloveImages.forEach(glove => {
        glove.addEventListener('click', () => {
            const gloveNumber = glove.dataset.glove;
            selectedGlove = gloveNumber;
            localStorage.setItem('selectedGlove', gloveNumber);
            updateGloveSelection(gloveNumber);
        });
    });

    // Handle game button click
    const gameButton = document.querySelector('button');
    gameButton.addEventListener('click', () => {
        window.location.href = 'gamePage.html';
    });

    // Sound Controls
    const soundToggle = document.getElementById('sound');
    const volumeSlider = document.getElementById('volume');
    const volumeValue = document.getElementById('volumeValue');

    // Load saved sound settings
    const savedSound = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('volume');

    soundToggle.checked = savedSound === null ? true : savedSound === 'true';
    volumeSlider.value = savedVolume || 50;
    volumeValue.textContent = `${volumeSlider.value}%`;

    // Update sound settings
    soundToggle.addEventListener('change', () => {
        localStorage.setItem('soundEnabled', soundToggle.checked);
    });

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        volumeValue.textContent = `${value}%`;
        localStorage.setItem('volume', value);
    });
});
