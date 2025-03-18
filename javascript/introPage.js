document.addEventListener('DOMContentLoaded', () => {
    const gloveImages = document.querySelectorAll('.glove-image');
    let selectedGlove = localStorage.getItem('selectedGlove') || '1';

    // Function to update selected glove appearance
    const updateGloveSelection = (gloveNumber) => {
        gloveImages.forEach(glove => {
            if (glove.dataset.glove === gloveNumber) {
                glove.classList.add('bg-blue-100', 'border-blue-500');
                glove.classList.remove('bg-gray-200', 'border-transparent');
            } else {
                glove.classList.remove('bg-blue-100', 'border-blue-500');
                glove.classList.add('bg-gray-200', 'border-transparent');
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

    // Handle game button click - FIX: using anchor tag in the HTML
    const gameButton = document.querySelector('a[href="gamePage.html"]');
    if (gameButton) {
        gameButton.addEventListener('click', (e) => {
            // Keep the default behavior for the anchor tag
            // The href attribute already handles navigation
        });
    }

    // Sound Controls
    const soundToggle = document.getElementById('sound');
    const volumeSlider = document.getElementById('volume');
    const volumeValue = document.getElementById('volumeValue');
    const volumeContainer = volumeSlider.closest('.space-y-2');

    // Function to toggle volume controls visibility with animation
    const toggleVolumeControls = (isVisible) => {
        console.log('Toggling volume controls:', isVisible);
        if (isVisible) {
            volumeContainer.style.display = 'block';
            // Give browser time to register display change before animating
            setTimeout(() => {
                volumeContainer.style.opacity = '1';
                volumeContainer.style.transform = 'translateY(0)';
            }, 10);
        } else {
            volumeContainer.style.opacity = '0';
            volumeContainer.style.transform = 'translateY(-10px)';
            // Wait for animation to finish before hiding
            setTimeout(() => {
                volumeContainer.style.display = 'none';
            }, 300);
        }
    };

    // Make sure volume container has transition styles
    volumeContainer.style.transition = 'all 0.3s ease-in-out';
    volumeContainer.style.opacity = soundToggle.checked ? '1' : '0';
    volumeContainer.style.transform = soundToggle.checked ? 'translateY(0)' : 'translateY(-10px)';

    // Load saved sound settings
    const savedSound = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('volume');

    soundToggle.checked = savedSound === null ? true : savedSound === 'true';
    volumeSlider.value = savedVolume || 50;
    volumeValue.textContent = `${volumeSlider.value}%`;

    // Set initial volume controls visibility
    toggleVolumeControls(soundToggle.checked);

    // After DOMContentLoaded
    console.log('Initial toggle state:', soundToggle.checked);
    console.log('Volume container display:', volumeContainer.style.display);

    // Update sound settings
    soundToggle.addEventListener('change', () => {
        console.log('Toggle changed:', soundToggle.checked);
        localStorage.setItem('soundEnabled', soundToggle.checked);
        toggleVolumeControls(soundToggle.checked);
    });

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        volumeValue.textContent = `${value}%`;
        localStorage.setItem('volume', value);
    });
});
