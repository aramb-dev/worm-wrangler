document.addEventListener('DOMContentLoaded', () => {
    // Get selected glove first to avoid reference errors
    const selectedGlove = localStorage.getItem('selectedGlove') || '1';

    // Debug output to check script loading
    console.log('Game page script loaded');
    console.log('Selected glove:', selectedGlove);

    // Game elements
    const holes = document.querySelectorAll('.hole');
    const worms = document.querySelectorAll('.worm');
    const tray = document.querySelector('.tray');
    const startButton = document.querySelector('.start-button');
    const homeButton = document.querySelector('.home-button');
    const scoreDisplay = document.querySelector('.scoreBoardText:nth-child(2) span');
    const missesDisplay = document.querySelector('.scoreBoardText:nth-child(3) span');
    const wormsDisplay = document.querySelector('.scoreBoardText:nth-child(4) span');
    const timeDisplay = document.querySelector('.scoreBoardText:nth-child(1) span');

    console.log('Tray element found:', !!tray);

    // Preload audio elements
    const hitSound = new Audio('../audio/hit.wav');
    const missSound = new Audio('../audio/miss.wav');
    const completionSound = new Audio('../audio/completion.wav');

    // Game state
    let score = 0;
    let misses = 0;
    let wormsCaught = 0;
    let timeLeft = 20;
    let gameActive = false;
    let timer;
    // Default sound to enabled if not explicitly disabled
    let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    let volume = parseInt(localStorage.getItem('volume') || '50');

    console.log('Sound enabled:', soundEnabled);
    console.log('Volume level:', volume);

    // Initialize audio settings
    [hitSound, missSound, completionSound].forEach(audio => {
        audio.volume = volume / 100;
    });

    // Set initial cursor based on selected glove
    document.body.style.cursor = `url('../images/openHand${selectedGlove}.png') 25 25, auto`;

    // Check if buttons exist before adding event listeners
    if (!startButton || !homeButton) {
        console.error('Required buttons not found in DOM');
        return;
    }

    // Game functions
    function showWorm(hole) {
        if (!gameActive) return;

        const worm = hole.querySelector('.worm');
        worm.style.backgroundImage = `url('../images/movingWorm${Math.floor(Math.random() * 3) + 1}.png')`;
        worm.style.backgroundSize = 'contain';
        worm.style.backgroundRepeat = 'no-repeat';
        worm.style.backgroundPosition = 'center';
        worm.style.display = 'block';
        worm.style.cursor = `url('../images/openHand${selectedGlove}.png') 25 25, pointer`;

        // Add click event listener to each worm
        worm.addEventListener('click', catchWorm);

        const duration = Math.random() * 1000 + 500; // Random duration between 0.5s and 1.5s

        setTimeout(() => {
            if (worm.style.display === 'block') {
                worm.style.display = 'none';
                worm.removeEventListener('click', catchWorm);
                missWorm();
            }
        }, duration);
    }

    function catchWorm(e) {
        if (!gameActive) return;

        const worm = e.target;
        if (!worm || worm.style.display !== 'block') {
            missWorm();
            return;
        }

        // Visual feedback for catching
        worm.style.cursor = `url('../images/closeHand${selectedGlove}.png') 25 25, pointer`;

        // Update score and display
        score += 5;
        wormsCaught++;
        scoreDisplay.textContent = score;
        wormsDisplay.textContent = wormsCaught;

        // Play sound
        if (soundEnabled) {
            console.log('Playing hit sound');
            hitSound.currentTime = 0;
            hitSound.play().catch(err => console.error('Error playing sound:', err));
        }

        // Add worm to tray with improved styling
        const wormIcon = document.createElement('img');
        wormIcon.src = '../images/worms.png';
        wormIcon.style.width = '32px';
        wormIcon.style.height = '32px';
        wormIcon.style.display = 'inline-block';
        wormIcon.style.margin = '4px';
        wormIcon.style.opacity = '0';
        wormIcon.style.transition = 'opacity 0.3s ease-out';
        tray.appendChild(wormIcon);

        // Force reflow to ensure transition works
        void wormIcon.offsetWidth;
        wormIcon.style.opacity = '1';

        // Hide caught worm
        worm.style.display = 'none';
        worm.removeEventListener('click', catchWorm);

        // Check win condition
        if (wormsCaught >= 6) endGame(true);
    }

    function missWorm() {
        if (!gameActive) return;

        misses++;
        missesDisplay.textContent = misses;

        if (soundEnabled) {
            console.log('Playing miss sound');
            missSound.currentTime = 0;
            missSound.play().catch(err => console.error('Error playing sound:', err));
        }

        // Check loss condition
        if (misses >= 8) endGame(false);
    }

    function startGame() {
        console.log('Starting game');
        if (!gameActive) {
            // Disable start button during game
            startButton.disabled = true;
            startButton.classList.add('opacity-50', 'cursor-not-allowed');

            // Reset game state
            score = 0;
            misses = 0;
            wormsCaught = 0;
            timeLeft = 20;
            gameActive = true;
            tray.innerHTML = '';

            // Update displays
            scoreDisplay.textContent = score;
            missesDisplay.textContent = misses;
            wormsDisplay.textContent = wormsCaught;
            timeDisplay.textContent = timeLeft;

            // Start spawning worms
            timer = setInterval(() => {
                timeLeft--;
                timeDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    endGame(wormsCaught >= 6);
                    return;
                }

                const randomHole = holes[Math.floor(Math.random() * holes.length)];
                showWorm(randomHole);
            }, 1000);
        }
    }

    function endGame(isVictory) {
        gameActive = false;
        clearInterval(timer);

        // Re-enable start button
        startButton.disabled = false;
        startButton.classList.remove('opacity-50', 'cursor-not-allowed');

        if (soundEnabled) {
            console.log('Playing completion sound');
            completionSound.currentTime = 0;
            completionSound.play().catch(err => console.error('Error playing sound:', err));
        }

        setTimeout(() => {
            if (isVictory) {
                // Show victory modal instead of alert
                openModal(document.getElementById('victory_modal'));

                // Add event listeners to modal buttons
                document.getElementById('restart_button').addEventListener('click', () => {
                    closeModal(document.getElementById('victory_modal'));
                    startGame();
                });

                document.getElementById('home_modal_button').addEventListener('click', () => {
                    closeModal(document.getElementById('victory_modal'));
                    window.location.href = '../index.html';
                });
            } else {
                // For game over, still use the alert for now
                alert('Game Over! Try again!');
            }
        }, 100);
    }

    // Event listeners with error handling
    startButton.addEventListener('click', (e) => {
        console.log('Start button clicked');
        e.preventDefault();
        if (!gameActive) {
            startGame();
        }
    });

    homeButton.addEventListener('click', (e) => {
        console.log('Home button clicked');
        e.preventDefault();
        // Fix the path to go up one directory
        window.location.href = '../index.html';
    });

    // Add button hover states
    [startButton, homeButton].forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('transform', 'scale-105');
        });

        button.addEventListener('mouseleave', () => {
            button.classList.remove('transform', 'scale-105');
        });
    });

    // Change cursor on mousedown/mouseup to simulate grabbing
    document.addEventListener('mousedown', () => {
        document.body.style.cursor = `url('../images/closeHand${selectedGlove}.png') 25 25, auto`;
    });
    document.addEventListener('mouseup', () => {
        document.body.style.cursor = `url('../images/openHand${selectedGlove}.png') 25 25, auto`;
    });

    // Prevent cursor flickering when dragging
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Make sure worms are clickable
    worms.forEach(worm => {
        worm.style.cursor = `url('../images/openHand${selectedGlove}.png') 25 25, pointer`;
    });
});