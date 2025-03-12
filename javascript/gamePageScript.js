document.addEventListener('DOMContentLoaded', () => {
    // Add this at the start of your script
    console.log('Selected glove:', localStorage.getItem('selectedGlove'));
    console.log('Setting cursor:', `url('images/openHand${selectedGlove}.png') 25 25, auto`);

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

    // Audio elements
    const hitSound = document.querySelector('audio[src="audio/hit.wav"]');
    const missSound = document.querySelector('audio[src="audio/miss.wav"]');
    const completionSound = document.querySelector('audio[src="audio/completion.wav"]');

    // Game state
    let score = 0;
    let misses = 0;
    let wormsCaught = 0;
    let timeLeft = 20;
    let gameActive = false;
    let timer;
    let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    let volume = localStorage.getItem('volume') || 50;

    // Initialize audio settings
    [hitSound, missSound, completionSound].forEach(audio => {
        audio.volume = volume / 100;
    });

    // Set initial cursor based on selected glove
    const selectedGlove = localStorage.getItem('selectedGlove') || '1';
    document.body.style.cursor = `url('images/openHand${selectedGlove}.png') 25 25, auto`;

    if (!startButton || !homeButton) {
        console.error('Required buttons not found in DOM');
        return;
    }

    // Game functions
    function showWorm(hole) {
        if (!gameActive) return;

        const worm = hole.querySelector('.worm');
        worm.style.backgroundImage = `url('./images/movingWorm${Math.floor(Math.random() * 3) + 1}.png')`;
        worm.style.backgroundSize = 'contain';
        worm.style.backgroundRepeat = 'no-repeat';
        worm.style.backgroundPosition = 'center';
        worm.style.display = 'block';
        worm.style.cursor = `url('images/openHand${selectedGlove}.png') 25 25, pointer`;

        const duration = Math.random() * 1000 + 500; // Random duration between 0.5s and 1.5s

        setTimeout(() => {
            if (worm.style.display === 'block') {
                worm.style.display = 'none';
                missWorm();
            }
        }, duration);
    }

    function catchWorm(e) {
        if (!gameActive) return;

        const worm = e.target.closest('.worm');
        if (!worm || worm.style.display !== 'block') {
            missWorm();
            return;
        }

        // Visual feedback for catching
        worm.style.cursor = `url('./images/closeHand${selectedGlove}.png') 25 25, pointer`;

        // Update score and display
        score += 5;
        wormsCaught++;
        scoreDisplay.textContent = score;
        wormsDisplay.textContent = wormsCaught;

        // Play sound
        if (soundEnabled) hitSound.play();

        // Add worm to tray with animation
        const wormIcon = document.createElement('img');
        wormIcon.src = './images/worms.png';
        wormIcon.className = 'h-8 w-8 inline-block transform scale-0';
        tray.appendChild(wormIcon);

        // Animate worm appearing in tray
        requestAnimationFrame(() => {
            wormIcon.style.transform = 'scale(1)';
            wormIcon.style.transition = 'transform 0.2s ease-out';
        });

        // Hide caught worm
        worm.style.display = 'none';

        // Check win condition
        if (wormsCaught >= 6) endGame(true);
    }

    function missWorm() {
        if (!gameActive) return;

        misses++;
        missesDisplay.textContent = misses;

        if (soundEnabled) missSound.play();

        // Check loss condition
        if (misses >= 8) endGame(false);
    }

    function startGame() {
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

        if (soundEnabled) completionSound.play();

        setTimeout(() => {
            alert(isVictory ? 'Victory! You caught enough worms!' : 'Game Over! Try again!');
        }, 100);
    }

    // Event listeners with error handling
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!gameActive) {
            startGame();
        }
    });

    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.html';
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
        document.body.style.cursor = `url('images/closeHand${selectedGlove}.png') 25 25, auto`;
    });
    document.addEventListener('mouseup', () => {
        document.body.style.cursor = `url('images/openHand${selectedGlove}.png') 25 25, auto`;
    });

    // Prevent cursor flickering when dragging
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Make sure worms are clickable
    worms.forEach(worm => {
        worm.style.cursor = `url('images/openHand${selectedGlove}.png') 25 25, pointer`;
    });
});