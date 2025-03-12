# Worm Wrangler Game Documentation

## Table of Contents

1. Introduction
2. Game Structure
3. Homepage (index.html)
4. Game Page (gamePage.html)
5. JavaScript Implementation
6. Game Mechanics

## 1. Introduction

Worm Wrangler is a browser-based game where players catch worms appearing from holes within a time limit. The game features customizable controls, sound effects, and score tracking.

## 2. Game Structure

The game consists of two main parts:

- Homepage (Customization & Settings)
- Game Page (Main Gameplay)

Collecting workspace informationI'll help explain the key elements and functionality in both files. Let me update the Explanation.md with more detailed information:

## 3. Homepage (index.html)

### Homepage Elements ([index.html](index.html))

### Key Interactive Elements

1. **Glove Selection Area**

```html
<div class="gloves grid grid-cols-3 gap-4">
  <div class="glove-image" data-glove="1">
    <img src="./images/openHand1.png" alt="Glove 1" />
  </div>
  <!-- Similar divs for gloves 2 and 3 -->
</div>
```

- `data-glove` attribute stores the glove identifier
- Images switch between open/closed states during gameplay
- Selected glove is highlighted with blue background and ring

2. **Sound Controls**

```html
<div class="soundDiv">
  <!-- Toggle Switch -->
  <input type="checkbox" id="sound" class="sr-only peer" />
  <div class="peer-checked:bg-blue-500">...</div>

  <!-- Volume Slider -->
  <input type="range" id="volume" min="0" max="100" value="50" />
  <span id="volumeValue">50%</span>
</div>
```

- Toggle switch uses Tailwind's peer classes for styling
- Volume slider with real-time percentage display
- Settings persist using localStorage

## IntroPage Script (javascript/introPage.js)

### 1. Initialization

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const gloveImages = document.querySelectorAll(".glove-image");
  let selectedGlove = localStorage.getItem("selectedGlove") || "1";
});
```

- Runs when page loads
- Gets all glove elements
- Retrieves previously selected glove from storage

### 2. Glove Selection System

```javascript
const updateGloveSelection = (gloveNumber) => {
  gloveImages.forEach((glove) => {
    if (glove.dataset.glove === gloveNumber) {
      // Add selection styling
      glove.classList.add("bg-blue-200", "ring-2", "ring-blue-500");
      glove.classList.remove("bg-gray-200");
    } else {
      // Remove selection styling
      glove.classList.remove("bg-blue-200", "ring-2", "ring-blue-500");
      glove.classList.add("bg-gray-200");
    }
  });
};
```

- Updates visual appearance of selected glove
- Removes highlighting from unselected gloves
- Called on initial load and when user selects a new glove

### 3. Event Listeners

```javascript
// Glove selection
gloveImages.forEach((glove) => {
  glove.addEventListener("click", () => {
    const gloveNumber = glove.dataset.glove;
    selectedGlove = gloveNumber;
    localStorage.setItem("selectedGlove", gloveNumber);
    updateGloveSelection(gloveNumber);
  });
});

// Game start
const gameButton = document.querySelector("button");
gameButton.addEventListener("click", () => {
  window.location.href = "gamePage.html";
});
```

- Handles glove selection clicks
- Stores selection in localStorage
- Navigates to game page when start button clicked

### 4. Sound Settings Management

```javascript
// Load saved settings
const savedSound = localStorage.getItem("soundEnabled");
const savedVolume = localStorage.getItem("volume");

soundToggle.checked = savedSound === null ? true : savedSound === "true";
volumeSlider.value = savedVolume || 50;

// Update settings
soundToggle.addEventListener("change", () => {
  localStorage.setItem("soundEnabled", soundToggle.checked);
});

volumeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  volumeValue.textContent = `${value}%`;
  localStorage.setItem("volume", value);
});
```

- Loads previously saved sound settings
- Updates toggle switch and volume slider positions
- Saves changes to localStorage
- Updates volume display in real-time

### Key Features

1. **Persistence**: All settings (glove selection, sound, volume) persist between sessions
2. **Real-time Updates**: Visual feedback for all user interactions
3. **Default Values**: Fallback values if no settings are saved
4. **Responsive Design**: Works on all screen sizes using Tailwind CSS
5. **Accessibility**: Proper labels and ARIA attributes for controls

## 4. Game Page (gamePage.html)

### Layout

- Game board with 9 holes (3x3 grid)
- Score display
- Timer
- Worm collection tray
- Game controls

### Elements

- Holes: Where worms appear
- Worms: Targets to catch
- Scoreboard: Displays time, score, misses, and worms caught
- Control buttons: Start Game and Home

## 5. JavaScript Implementation

### Game State Management

```javascript
// Core game variables
let score = 0;
let misses = 0;
let wormsCaught = 0;
let timeLeft = 20;
let gameActive = false;
```

### Key Functions

#### showWorm(hole)

```javascript
// Displays a worm in a random hole
function showWorm(hole) {
  if (!gameActive) return;

  const worm = hole.querySelector(".worm");
  // Set random worm image
  worm.style.backgroundImage = `url('./images/movingWorm${
    Math.floor(Math.random() * 3) + 1
  }.png')`;
  worm.style.display = "block";

  // Hide worm after random duration
  const duration = Math.random() * 1000 + 500;
  setTimeout(() => {
    /* hide worm logic */
  }, duration);
}
```

#### catchWorm(e)

```javascript
// Handles worm catching attempts
function catchWorm(e) {
  if (!gameActive) return;

  const worm = e.target.closest(".worm");
  if (!worm || worm.style.display !== "block") {
    missWorm();
    return;
  }

  // Update score and display
  score += 5;
  wormsCaught++;
  // Add worm to tray
  // Check win condition
}
```

#### startGame()

```javascript
// Initializes and starts the game
function startGame() {
  // Reset game state
  score = 0;
  misses = 0;
  wormsCaught = 0;
  timeLeft = 20;
  gameActive = true;

  // Start timer and worm spawning
  timer = setInterval(() => {
    timeLeft--;
    // Spawn worms
    // Check game end conditions
  }, 1000);
}
```

## 6. Game Mechanics

### Win Conditions

- Catch 6 or more worms within 20 seconds
- Each worm caught adds 5 points to the score

### Loss Conditions

- Missing 8 or more worms
- Time runs out with fewer than 6 worms caught

### Cursor Mechanics

```javascript
// Changes cursor based on mouse state
document.addEventListener("mousedown", () => {
  document.body.style.cursor = `url('./images/closeHand${selectedGlove}.png'), auto`;
});
document.addEventListener("mouseup", () => {
  document.body.style.cursor = `url('./images/openHand${selectedGlove}.png'), auto`;
});
```

### Sound System

- Hit sound: Plays when successfully catching a worm
- Miss sound: Plays when missing a worm
- Completion sound: Plays at game end
- Volume control affects all game sounds
- Sound settings persist between sessions

## Learning Outcomes

1. DOM Manipulation
2. Event Handling
3. Game State Management
4. Timing Functions
5. Local Storage Usage
6. Responsive Design
7. Audio Implementation
8. CSS Animation
9. User Input Handling
10. Score Tracking Systems
