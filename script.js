/* ==========================================
   SHAKI'S UNIVERSE - JAVASCRIPT (script.js)
   ========================================== */

// ------------------------------------------
// 1. DATA STORES & CONFIGURATION
// ------------------------------------------

const MOTIVATIONAL_QUOTES = [
    { text: "Believe you can and you're halfway there. ✨", author: "The Galaxy" },
    { text: "You are capable of amazing things, Shaki! 🌸", author: "Cosmic Vibes" },
    { text: "Make today so awesome that yesterday gets jealous! 💫", author: "Sparky the Pixie" },
    { text: "Your vibe attracts your tribe. Keep glowing, gorgeous! 🌟", author: "Universe Voice" },
    { text: "Every day is a fresh start to chase your biggest dreams. 🌈", author: "Dream Catcher" },
    { text: "Shine bright like the beautiful star you are! ⭐", author: "Stardust Whispers" },
    { text: "Small steps in the right direction lead to wonderful destinations. 💜", author: "Destiny" },
    { text: "You do not have to be perfect to be absolutely amazing. 💖", author: "Heart Notes" },
    { text: "Your potential is limitless, Shaki. Keep pushing forward! 🚀", author: "Nebula Guide" },
    { text: "Be proud of how far you've come, and trust how far you can go. 🍃", author: "Inner Wisdom" }
];

const COMPLIMENTS = [
    "Shaki, your smile has the power to light up the whole room! ☀️",
    "You possess a heart of pure gold, and it shows in everything you do. 💛",
    "You are a wonderful listener and a truly precious, irreplaceable friend. 👭",
    "Your creativity and unique ideas inspire everyone around you. 🎨",
    "You are incredibly strong, resilient, and capable of overcoming anything. 💪",
    "The world is simply a better, happier place because you are in it. 🌍",
    "Your positive energy is absolutely contagious, Shaki! 🤩",
    "You have a unique style and grace that makes you stand out beautifully. 💃",
    "Your kindness is a magical gift to everyone who meets you. 🎁",
    "You are smart, capable, and have the most amazing perspective on things! 🧠"
];

const MOOD_RESPONSES = {
    happy: {
        text: "Yay! Your happiness is like pure sunshine! ☀️ Share your smile, write down what made you happy, and keep shining bright, Shaki! 💛",
        icon: "😊",
        color: "var(--sticky-pink)"
    },
    sad: {
        text: "It is okay to feel sad, sweetie. 😢 Take a deep breath, wrap yourself in a warm blanket, and remember that clouds always pass. You are deeply loved. 💜",
        icon: "😢",
        color: "var(--sticky-lavender)"
    },
    stressed: {
        text: "Let's take a pause. 🧘‍♀️ Breathe in... Breathe out... You don't have to carry the whole world at once. You are doing enough. 🌸",
        icon: "😫",
        color: "var(--sticky-blue)"
    },
    tired: {
        text: "Your body is asking for a little rest. 😴 Cozy up, drink some warm tea, close your eyes, and recharge your beautiful battery. Sleep tight! 🍵",
        icon: "😴",
        color: "var(--sticky-cream)"
    },
    excited: {
        text: "Woohoo! Let's ride this wave of awesome energy! 🤩 Put on your favorite dance track, text a friend, and celebrate this moment! 🎉",
        icon: "🤩",
        color: "var(--sticky-pink)"
    }
};

const WHEEL_OPTIONS = [
    "Watch a movie 🍿",
    "Eat ice cream 🍦",
    "Dance for 5 mins 💃",
    "Take a selfie 📸",
    "Listen to music 🎵",
    "Call a friend ☎️",
    "Go for a walk 🚶‍♀️",
    "Read a book 📖"
];

const DAILY_CHALLENGES = [
    "Drink 8 glasses of water today 💧",
    "Smile at 3 people you walk past today 😊",
    "Write down one good thing about yourself 📝",
    "Go for a 10-minute walk outside 🌳",
    "Take a 1-hour break from all social media 📱",
    "Compliment a friend or family member today 💬",
    "Organize or clean your desk space 🧹",
    "Stretch your body for 5 minutes 🧘‍♀️",
    "Write down three things you are grateful for today ✨",
    "Listen to a new song and relax completely 🎵"
];

const SECRET_MESSAGES = [
    "Shaki, you are doing better than you think! Keep going. 💜",
    "Never forget how special you are. The universe is cheering for you! 🌌",
    "A secret message: You have a beautiful soul. ✨",
    "Take a moment to hug yourself today! You deserve love. 🤗",
    "Your dreams are valid, Shaki. Pin them up and make them real! 🌈",
    "Sending you a giant cosmic hug! 🪐💖",
    "You make the world warmer just by being in it. 🌻",
    "Believe in the magic inside you. It's real! 🪄"
];

// ------------------------------------------
// 2. STATE MANAGER (localStorage)
// ------------------------------------------
let parsedDreams = null;
try {
    parsedDreams = JSON.parse(localStorage.getItem("shaki_dreams"));
} catch (e) {
    parsedDreams = null;
}

const state = {
    stars: parseInt(localStorage.getItem("shaki_stars")) || 0,
    theme: localStorage.getItem("shaki_theme") || "day",
    dreams: (parsedDreams && Array.isArray(parsedDreams)) ? parsedDreams : [
        { id: 1, text: "Chase dreams, smile often! ✨", color: "pink", date: "2026-06-10" },
        { id: 2, text: "Eat lots of chocolate ice cream 🍦", color: "blue", date: "2026-06-10" }
    ],
    lastChallengeDate: localStorage.getItem("shaki_challenge_date") || "",
    currentChallenge: localStorage.getItem("shaki_current_challenge") || DAILY_CHALLENGES[0],
    challengeCompletedToday: localStorage.getItem("shaki_challenge_completed") === "true",
    clickerHighScore: parseInt(localStorage.getItem("shaki_clicker_high")) || 0
};

// Sync state helpers
function saveState() {
    localStorage.setItem("shaki_stars", state.stars);
    localStorage.setItem("shaki_theme", state.theme);
    localStorage.setItem("shaki_dreams", JSON.stringify(state.dreams));
    localStorage.setItem("shaki_challenge_date", state.lastChallengeDate);
    localStorage.setItem("shaki_current_challenge", state.currentChallenge);
    localStorage.setItem("shaki_challenge_completed", state.challengeCompletedToday);
    localStorage.setItem("shaki_clicker_high", state.clickerHighScore);
}

// ------------------------------------------
// 3. BACKGROUND CANVAS PARTICLES
// ------------------------------------------
const canvas = document.getElementById("universe-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: null, y: null };

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    
    // Create base particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
}

function createParticle() {
    const isNight = state.theme === "night";
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isNight ? 2.5 : 4) + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: getRandomParticleColor(),
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        type: Math.random() > 0.85 ? "star" : (Math.random() > 0.95 ? "heart" : "dot")
    };
}

function getRandomParticleColor() {
    const isNight = state.theme === "night";
    if (isNight) {
        const colors = ["#FCD34D", "#C084FC", "#F472B6", "#60A5FA", "#FFFFFF"];
        return colors[Math.floor(Math.random() * colors.length)];
    } else {
        const colors = ["#FFB7D5", "#D7B5FF", "#B3E5FC", "#FFF59D", "#B2DFDB"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;

    if (p.type === "star") {
        // Draw standard 4-point star
        ctx.beginPath();
        const startX = p.x + Math.cos(0) * p.size * 1.8;
        const startY = p.y + Math.sin(0) * p.size * 1.8;
        ctx.moveTo(startX, startY);
        for (let i = 0; i < 4; i++) {
            ctx.lineTo(
                p.x + Math.cos((i * Math.PI) / 2) * p.size * 1.8,
                p.y + Math.sin((i * Math.PI) / 2) * p.size * 1.8
            );
            ctx.lineTo(
                p.x + Math.cos((i * Math.PI) / 2 + Math.PI / 4) * p.size * 0.6,
                p.y + Math.sin((i * Math.PI) / 2 + Math.PI / 4) * p.size * 0.6
            );
        }
        ctx.closePath();
        ctx.fill();
    } else if (p.type === "heart") {
        // Draw small cute heart
        ctx.beginPath();
        const d = p.size * 1.3;
        ctx.moveTo(p.x, p.y + d / 4);
        ctx.bezierCurveTo(p.x - d / 2, p.y - d / 2, p.x - d, p.y + d / 3, p.x, p.y + d);
        ctx.bezierCurveTo(p.x + d, p.y + d / 3, p.x + d / 2, p.y - d / 2, p.x, p.y + d / 4);
        ctx.fill();
    } else {
        // Default circle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce borders
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Pulse transparency
        p.alpha += p.pulseSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.2) {
            p.pulseSpeed *= -1;
        }

        // Subtly react to mouse hover
        if (mouse.x && mouse.y) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
                const force = (120 - dist) / 120 * 0.15;
                p.x -= dx * force * 0.2;
                p.y -= dy * force * 0.2;
            }
        }

        drawParticle(p);
    });

    requestAnimationFrame(updateParticles);
}

// Event Listeners for Canvas
window.addEventListener("resize", () => {
    initCanvas();
});

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});


// ------------------------------------------
// 4. DAY / NIGHT THEME CONTROLLER
// ------------------------------------------
const themeToggle = document.getElementById("theme-toggle");
const sunIcon = themeToggle.querySelector(".sun-icon");
const moonIcon = themeToggle.querySelector(".moon-icon");

function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    if (state.theme === "night") {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    } else {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    }
    // Re-initialize particles to update color palettes
    initCanvas();
}

themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "day" ? "night" : "day";
    saveState();
    applyTheme();
});


// ------------------------------------------
// 5. MOTIVATION SECTION (FLIP CARD)
// ------------------------------------------
const quoteCard = document.getElementById("quote-card");
const quoteText = quoteCard.querySelector(".quote-text");
const quoteAuthor = quoteCard.querySelector(".quote-author");
const motivateBtn = document.getElementById("motivate-btn");

function renderRandomQuote() {
    // Add flip transition animation
    quoteCard.classList.add("flip-anim");
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        const quote = MOTIVATIONAL_QUOTES[randomIndex];
        quoteText.innerText = `"${quote.text}"`;
        quoteAuthor.innerText = `— ${quote.author}`;
        quoteCard.classList.remove("flip-anim");
    }, 300);
}

motivateBtn.addEventListener("click", () => {
    renderRandomQuote();
    createHeartBurst(motivateBtn);
});


// ------------------------------------------
// 6. COMPLIMENT GENERATOR
// ------------------------------------------
const complimentDisplay = document.getElementById("compliment-display");
const complimentBtn = document.getElementById("compliment-btn");

function generateCompliment() {
    const randomIndex = Math.floor(Math.random() * COMPLIMENTS.length);
    const text = COMPLIMENTS[randomIndex];
    
    // Scale out and swap content
    complimentDisplay.style.transform = "scale(0.95)";
    complimentDisplay.style.opacity = "0.7";
    
    setTimeout(() => {
        complimentDisplay.innerText = text;
        complimentDisplay.style.transform = "scale(1)";
        complimentDisplay.style.opacity = "1";
        // Create float elements inside
        for (let i = 0; i < 8; i++) {
            spawnHeartOnElement(complimentDisplay);
        }
    }, 200);
}

complimentBtn.addEventListener("click", () => {
    generateCompliment();
    createHeartBurst(complimentBtn);
});

// Helper: Heart blast effect on buttons
function createHeartBurst(btn) {
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.innerText = Math.random() > 0.5 ? "💖" : "✨";
        heart.style.left = `${rect.width / 2 + (Math.random() - 0.5) * 40}px`;
        heart.style.top = `${rect.height / 2 + (Math.random() - 0.5) * 20}px`;
        
        // Custom physics
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 4 + 2;
        const xDist = Math.cos(angle) * velocity * 20;
        const yDist = Math.sin(angle) * velocity * 20 - 50; // Tend upward
        
        heart.style.setProperty("--x", `${xDist}px`);
        heart.style.setProperty("--y", `${yDist}px`);
        
        btn.appendChild(heart);
        
        // CSS Animation for bursting
        heart.animate([
            { transform: 'translate(0, 0) scale(0.6)', opacity: 1 },
            { transform: `translate(${xDist}px, ${yDist}px) scale(1.4)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 400,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            fill: 'forwards'
        });

        setTimeout(() => heart.remove(), 1500);
    }
}

function spawnHeartOnElement(el) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerText = ["💖", "✨", "🌸", "⭐"][Math.floor(Math.random() * 4)];
    
    const x = Math.random() * el.clientWidth;
    const y = Math.random() * el.clientHeight;
    
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    el.appendChild(heart);
    
    heart.animate([
        { transform: 'translate(0, 0) scale(0.5) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 60}px, -120px) scale(1.5) rotate(${(Math.random() - 0.5) * 60}deg)`, opacity: 0 }
    ], {
        duration: 1500 + Math.random() * 500,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    setTimeout(() => heart.remove(), 2100);
}


// ------------------------------------------
// 7. MOOD BOOSTER
// ------------------------------------------
const moodButtons = document.querySelectorAll(".mood-btn");
const moodResponse = document.getElementById("mood-response");

moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Deactivate past active
        moodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const mood = btn.dataset.mood;
        const config = MOOD_RESPONSES[mood];
        
        moodResponse.style.transform = "scale(0.97)";
        moodResponse.style.opacity = "0.7";
        
        setTimeout(() => {
            moodResponse.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; width:100%;">
                    <span style="font-size: 2.2rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">${config.icon}</span>
                    <p class="mood-text" style="color:var(--text-primary); font-size:1.05rem;">${config.text}</p>
                </div>
            `;
            moodResponse.style.border = `1.5px solid ${config.color}`;
            moodResponse.style.transform = "scale(1)";
            moodResponse.style.opacity = "1";
            spawnHeartOnElement(moodResponse);
        }, 150);
    });
});


// ------------------------------------------
// 8. FUN WHEEL OF FORTUNE
// ------------------------------------------
const wheelCanvas = document.getElementById("wheel-canvas");
const wheelCtx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");

let isSpinning = false;
let currentRotation = 0;
const totalSlices = WHEEL_OPTIONS.length;
const arcSize = (Math.PI * 2) / totalSlices;

// Slices custom color palettes (pastel mix)
const sliceColors = ["#ffd3e8", "#e8d7ff", "#d0f0ff", "#fef0db", "#ffd3e8", "#e8d7ff", "#d0f0ff", "#fef0db"];

function drawWheel() {
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 8;
    
    wheelCtx.clearRect(0, 0, size, size);
    
    for (let i = 0; i < totalSlices; i++) {
        const angle = currentRotation + i * arcSize;
        
        // Draw slices
        wheelCtx.beginPath();
        wheelCtx.fillStyle = sliceColors[i];
        wheelCtx.moveTo(center, center);
        wheelCtx.arc(center, center, radius, angle, angle + arcSize);
        wheelCtx.lineTo(center, center);
        wheelCtx.fill();
        
        // Outer boundary white line
        wheelCtx.strokeStyle = "rgba(255,255,255,0.7)";
        wheelCtx.lineWidth = 2;
        wheelCtx.stroke();
        
        // Render labels
        wheelCtx.save();
        wheelCtx.fillStyle = "#4a3e56"; // readable dark text
        wheelCtx.font = "bold 11px 'Nunito', sans-serif";
        wheelCtx.textAlign = "right";
        wheelCtx.translate(center, center);
        wheelCtx.rotate(angle + arcSize / 2);
        
        // Slice text draw
        const label = WHEEL_OPTIONS[i];
        wheelCtx.fillText(label, radius - 15, 4);
        wheelCtx.restore();
    }
    
    // Draw center peg
    wheelCtx.beginPath();
    wheelCtx.arc(center, center, 24, 0, Math.PI * 2);
    wheelCtx.fillStyle = "#ffffff";
    wheelCtx.shadowBlur = 8;
    wheelCtx.shadowColor = "rgba(0,0,0,0.15)";
    wheelCtx.fill();
    wheelCtx.shadowBlur = 0; // reset shadow
    
    wheelCtx.beginPath();
    wheelCtx.arc(center, center, 14, 0, Math.PI * 2);
    wheelCtx.fillStyle = "var(--accent-secondary)";
    wheelCtx.fill();
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    
    const spinDuration = 4000; // 4s
    const startTimestamp = performance.now();
    
    // Calculate full spin loops plus random angle
    const startRotation = currentRotation % (Math.PI * 2);
    const targetSpins = 6 + Math.random() * 5;
    const finalRotations = startRotation + targetSpins * Math.PI * 2;
    
    function animateSpin(now) {
        const elapsed = now - startTimestamp;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Cubic decel easing curve: 1 - (1 - x)^4
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        currentRotation = startRotation + easeProgress * (finalRotations - startRotation);
        
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            isSpinning = false;
            determineWheelWinner();
        }
    }
    
    requestAnimationFrame(animateSpin);
}

function determineWheelWinner() {
    // Math to compute index. Compass pointer is at 12 o'clock (-Math.PI/2)
    // Find the offset rotation angle
    const netRot = (currentRotation + Math.PI / 2) % (Math.PI * 2);
    // Inverse matching rotation index
    const invertedAngle = (Math.PI * 2 - netRot) % (Math.PI * 2);
    let winningIndex = Math.floor(invertedAngle / arcSize);
    
    // Ensure index limits
    winningIndex = (winningIndex + totalSlices) % totalSlices;
    const prize = WHEEL_OPTIONS[winningIndex];
    
    // Show results overlay modal
    openCelebrationModal("🎡 Wheel Decision!", `The stars have spoken, Shaki! You should do this today:<br><strong style="font-size:1.35rem; color:var(--accent-primary); display:block; margin-top:0.75rem;">${prize}</strong>`, "🍦 Treat Time! 🎉");
}

spinBtn.addEventListener("click", () => {
    spinWheel();
});


// ------------------------------------------
// 9. DAILY CHALLENGES & STARS SYSTEM
// ------------------------------------------
const challengeTitle = document.getElementById("current-challenge-title");
const completeChallengeBtn = document.getElementById("complete-challenge-btn");
const newChallengeBtn = document.getElementById("new-challenge-btn");
const headerStarCount = document.getElementById("header-star-count");
const totalStarsDisplay = document.getElementById("total-stars");
const badgeTitleDisplay = document.getElementById("badge-title");

function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
}

function loadChallenge() {
    const today = getTodayString();
    
    // If a new day has arrived, reset completed status
    if (state.lastChallengeDate !== today) {
        state.challengeCompletedToday = false;
        state.lastChallengeDate = today;
        // Roll new challenge
        state.currentChallenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
        saveState();
    }
    
    challengeTitle.innerText = state.currentChallenge;
    
    if (state.challengeCompletedToday) {
        completeChallengeBtn.disabled = true;
        completeChallengeBtn.innerHTML = "<span>Already Checked Today! ⭐</span>";
        completeChallengeBtn.style.opacity = "0.7";
        completeChallengeBtn.style.cursor = "default";
    } else {
        completeChallengeBtn.disabled = false;
        completeChallengeBtn.innerHTML = "<span>I Completed It! 🎉</span>";
        completeChallengeBtn.style.opacity = "1";
        completeChallengeBtn.style.cursor = "pointer";
    }
    
    updateScoreboards();
}

function completeChallenge() {
    if (state.challengeCompletedToday) return;
    
    state.challengeCompletedToday = true;
    state.stars += 1;
    saveState();
    
    updateScoreboards();
    loadChallenge(); // updates buttons
    
    openCelebrationModal("⭐ Star Awarded!", `Amazing job, Shaki! You completed today's challenge and earned a star! Keep shining.`, "Hooray! 💖");
}

function rollNewChallenge() {
    let roll;
    do {
        roll = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
    } while (roll === state.currentChallenge);
    
    state.currentChallenge = roll;
    state.challengeCompletedToday = false;
    saveState();
    loadChallenge();
    createHeartBurst(newChallengeBtn);
}

function updateScoreboards() {
    headerStarCount.innerText = state.stars;
    totalStarsDisplay.innerText = state.stars;
    
    // Compute badge/ranks
    let badgeText = "Novice 🌟";
    if (state.stars >= 25) {
        badgeText = "Cosmic Queen 👑";
    } else if (state.stars >= 15) {
        badgeText = "Galaxy Explorer 🌌";
    } else if (state.stars >= 8) {
        badgeText = "Nebula Voyager 💫";
    } else if (state.stars >= 3) {
        badgeText = "Star Cadet 🌟";
    }
    badgeTitleDisplay.innerText = badgeText;
    
    // Toggle locking opacity on achievements
    syncBadgesVisibility();
}

function syncBadgesVisibility() {
    const badges = [
        { id: "badge-1", req: 3 },
        { id: "badge-2", req: 8 },
        { id: "badge-3", req: 15 },
        { id: "badge-4", req: 25 }
    ];
    
    badges.forEach(b => {
        const element = document.getElementById(b.id);
        if (state.stars >= b.req) {
            if (element.classList.contains("locked")) {
                element.classList.remove("locked");
                element.classList.add("new-unlocked");
                setTimeout(() => element.classList.remove("new-unlocked"), 3000);
            }
        } else {
            element.classList.add("locked");
        }
    });
}

completeChallengeBtn.addEventListener("click", completeChallenge);
newChallengeBtn.addEventListener("click", rollNewChallenge);


// ------------------------------------------
// 10. DREAM WALL
// ------------------------------------------
const dreamInput = document.getElementById("dream-input");
const addDreamBtn = document.getElementById("add-dream-btn");
const dreamBoard = document.getElementById("dream-board");
const colorPickers = document.querySelectorAll(".dream-color-pickers .color-picker");

let selectedColor = "pink";

colorPickers.forEach(picker => {
    picker.addEventListener("click", () => {
        colorPickers.forEach(p => p.classList.remove("active"));
        picker.classList.add("active");
        selectedColor = picker.dataset.color;
    });
});

function loadDreams() {
    dreamBoard.innerHTML = "";
    
    if (state.dreams.length === 0) {
        dreamBoard.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem 0;">
                No dreams pinned yet. Write your first dream above! 🌈
            </div>
        `;
        return;
    }
    
    state.dreams.forEach(dream => {
        const note = document.createElement("div");
        note.className = `sticky-note ${dream.color}`;
        
        // Random rotational offsets
        const rotationAngle = (Math.random() * 8 - 4).toFixed(1);
        note.style.setProperty("--rotation", `${rotationAngle}deg`);
        
        note.innerHTML = `
            <span class="sticky-note-delete" title="Complete Dream">&times;</span>
            <p class="sticky-note-content">${escapeHTML(dream.text)}</p>
            <span class="sticky-note-date">${dream.date}</span>
        `;
        
        // Delete action
        note.querySelector(".sticky-note-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            note.style.transform = "scale(0) rotate(20deg)";
            note.style.opacity = "0";
            setTimeout(() => {
                removeDream(dream.id);
            }, 300);
        });
        
        dreamBoard.appendChild(note);
    });
}

function removeDream(id) {
    state.dreams = state.dreams.filter(d => d.id !== id);
    saveState();
    loadDreams();
}

function addDream() {
    const text = dreamInput.value.trim();
    if (!text) return;
    
    const newDream = {
        id: Date.now(),
        text: text,
        color: selectedColor,
        date: getTodayString()
    };
    
    state.dreams.unshift(newDream);
    saveState();
    
    dreamInput.value = "";
    loadDreams();
}

addDreamBtn.addEventListener("click", addDream);
dreamInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addDream();
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


// ------------------------------------------
// 11. BREATHING TIMER (RELAXATION CORNER)
// ------------------------------------------
const startBreathBtn = document.getElementById("start-breath-btn");
const breathCircle = document.getElementById("breath-circle");
const breathInstruction = document.getElementById("breath-instruction");

let breathingActive = false;
let breathingInterval = null;

function runBreathingCycle() {
    if (!breathingActive) return;
    
    // 1. Inhale phase
    breathCircle.className = "breathing-circle inhale";
    breathInstruction.innerText = "Inhale... 🌸";
    
    setTimeout(() => {
        if (!breathingActive) return;
        // 2. Hold phase
        breathCircle.className = "breathing-circle hold";
        breathInstruction.innerText = "Hold... ✨";
        
        setTimeout(() => {
            if (!breathingActive) return;
            // 3. Exhale phase
            breathCircle.className = "breathing-circle exhale";
            breathInstruction.innerText = "Exhale... 🍃";
            
            setTimeout(() => {
                if (!breathingActive) return;
                // 4. Hold phase
                breathCircle.className = "breathing-circle hold";
                breathInstruction.innerText = "Hold... 💫";
                
                setTimeout(() => {
                    // Loop
                    runBreathingCycle();
                }, 4000);
            }, 4000);
        }, 4000);
    }, 4000);
}

function startBreathing() {
    breathingActive = true;
    startBreathBtn.querySelector("span").innerText = "Stop Breathing Exercise 🧘";
    startBreathBtn.classList.replace("primary-btn", "secondary-btn");
    runBreathingCycle();
}

function stopBreathing() {
    breathingActive = false;
    startBreathBtn.querySelector("span").innerText = "Start Breathing Exercise 🧘";
    startBreathBtn.classList.replace("secondary-btn", "primary-btn");
    
    // Reset visual
    breathCircle.className = "breathing-circle";
    breathInstruction.innerText = "Breathe";
}

startBreathBtn.addEventListener("click", () => {
    if (breathingActive) {
        stopBreathing();
    } else {
        startBreathing();
    }
});


// ------------------------------------------
// 12. STAR MAP - SECRET MESSAGES
// ------------------------------------------
const starMap = document.getElementById("star-map");
const secretDisclosure = document.getElementById("secret-disclosure");

function initStarMap() {
    starMap.innerHTML = "";
    
    // Draw 7 stars at relative randomized positions
    for (let i = 0; i < 8; i++) {
        const star = document.createElement("div");
        star.className = "map-star";
        star.innerText = "⭐";
        
        // Random offsets that don't bunch up too close to boundaries
        const left = 5 + Math.random() * 88;
        const top = 8 + Math.random() * 75;
        
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        
        // Stagger animations
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        // Star click bindings
        star.addEventListener("click", () => {
            // Pulse star
            star.classList.add("clicked");
            setTimeout(() => star.classList.remove("clicked"), 1000);
            
            const message = SECRET_MESSAGES[i];
            revealSecretMessage(message);
            
            // Increment minor stars award occasionally
            if (Math.random() > 0.7) {
                state.stars += 1;
                saveState();
                updateScoreboards();
            }
        });
        
        starMap.appendChild(star);
    }
}

function revealSecretMessage(msg) {
    secretDisclosure.style.transform = "scale(0.96)";
    secretDisclosure.style.opacity = "0.7";
    
    setTimeout(() => {
        secretDisclosure.innerHTML = `
            <div class="secret-revealed-text">
                <strong>💌 Cosmos Note:</strong> "${msg}"
            </div>
        `;
        secretDisclosure.style.transform = "scale(1)";
        secretDisclosure.style.opacity = "1";
    }, 150);
}


// ------------------------------------------
// 13. MINI GAMES (ARCADE CENTER)
// ------------------------------------------

// Tab Switching
const tabButtons = document.querySelectorAll(".games-tabs .tab-btn");
const tabContents = document.querySelectorAll(".games-container .tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const activeTabId = `tab-${btn.dataset.tab}`;
        tabContents.forEach(content => {
            if (content.id === activeTabId) {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        });
        
        // If clicking Clicker, ensure scoreboard loaded
        if (btn.dataset.tab === "clicker") {
            document.getElementById("clicker-high").innerText = state.clickerHighScore;
        }
    });
});

// A. Rock Paper Scissors
let pScore = 0;
let bScore = 0;
const pScoreEl = document.getElementById("rps-player-score");
const bScoreEl = document.getElementById("rps-bot-score");
const rpsResultEl = document.getElementById("rps-result");
const rpsButtons = document.querySelectorAll(".rps-choices .rps-btn");

rpsButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const pChoice = btn.dataset.choice;
        const choices = ["rock", "paper", "scissors"];
        const bChoice = choices[Math.floor(Math.random() * 3)];
        
        const emojiMap = { rock: "✊", paper: "✋", scissors: "✌️" };
        
        let resultText = "";
        let statusClass = "";
        
        if (pChoice === bChoice) {
            resultText = `It's a tie! Both chose ${emojiMap[pChoice]}. Let's go again! 🤝`;
        } else if (
            (pChoice === "rock" && bChoice === "scissors") ||
            (pChoice === "paper" && bChoice === "rock") ||
            (pChoice === "scissors" && bChoice === "paper")
        ) {
            pScore += 1;
            resultText = `You win! Shaki's ${emojiMap[pChoice]} beats Bot's ${emojiMap[bChoice]}. Woohoo! 🎉`;
            pScoreEl.innerText = pScore;
            
            // Sparkles on score increments
            createHeartBurst(btn);
            
            // Randomly award star for victory streaks
            if (pScore % 5 === 0) {
                state.stars += 1;
                saveState();
                updateScoreboards();
            }
        } else {
            bScore += 1;
            resultText = `Cosmo Bot wins this one! ${emojiMap[bChoice]} beats ${emojiMap[pChoice]}. You can do it next time! 🤖`;
            bScoreEl.innerText = bScore;
        }
        
        rpsResultEl.innerHTML = `<p style="font-size: 1rem; color: var(--text-primary);">${resultText}</p>`;
    });
});

// B. Number Guessing Game
let targetNumber = Math.floor(Math.random() * 100) + 1;
let guessAttemptsCount = 0;
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const guessResetBtn = document.getElementById("guess-reset-btn");
const guessCountEl = document.getElementById("guess-count");
const guessResultEl = document.getElementById("guess-result");

guessBtn.addEventListener("click", () => {
    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        guessResultEl.innerHTML = `<p style="color: #ef4444;">Please input a valid number between 1 and 100!</p>`;
        return;
    }
    
    guessAttemptsCount += 1;
    guessCountEl.innerText = guessAttemptsCount;
    
    if (userGuess === targetNumber) {
        guessResultEl.innerHTML = `<p style="color: #10b981;">Correct! 🎉 The number was <strong>${targetNumber}</strong>. You did it in ${guessAttemptsCount} attempts!</p>`;
        guessBtn.style.display = "none";
        guessResetBtn.style.display = "inline-flex";
        
        // Award stars for efficient guessing
        if (guessAttemptsCount <= 7) {
            state.stars += 2;
            openCelebrationModal("🧠 Master Guesser!", `Incredible guessing, Shaki! You found the correct number in just ${guessAttemptsCount} guesses. You earn +2 Stars!`, "Brilliant! ✨");
        } else {
            state.stars += 1;
            openCelebrationModal("🎉 Guessing Complete!", `Well done, Shaki! You got the number. You earn +1 Star!`, "Awesome! 🌟");
        }
        saveState();
        updateScoreboards();
    } else if (userGuess > targetNumber) {
        guessResultEl.innerHTML = `<p>Too high, Shaki! 📈 Try a lower number.</p>`;
    } else {
        guessResultEl.innerHTML = `<p>Too low, Shaki! 📉 Try a higher number.</p>`;
    }
    
    guessInput.value = "";
});

guessResetBtn.addEventListener("click", () => {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    guessAttemptsCount = 0;
    guessCountEl.innerText = "0";
    guessResultEl.innerHTML = `<p class="placeholder">Take your first guess!</p>`;
    guessBtn.style.display = "inline-flex";
    guessResetBtn.style.display = "none";
    guessInput.value = "";
});

// C. Click the Star
const clickerArena = document.getElementById("clicker-arena");
const startClickerBtn = document.getElementById("start-clicker-btn");
const clickerScoreEl = document.getElementById("clicker-score");
const clickerTimerEl = document.getElementById("clicker-timer");
const clickerHighEl = document.getElementById("clicker-high");
const clickerStartScreen = document.getElementById("clicker-start-screen");

let clickerScore = 0;
let clickerTimeLeft = 15;
let clickerTimerInterval = null;
let clickerGameActive = false;

function startClickerGame() {
    clickerGameActive = true;
    clickerScore = 0;
    clickerTimeLeft = 15;
    
    clickerScoreEl.innerText = "0";
    clickerTimerEl.innerText = "15";
    clickerStartScreen.style.display = "none";
    
    spawnClickerStar();
    
    clickerTimerInterval = setInterval(() => {
        clickerTimeLeft -= 1;
        clickerTimerEl.innerText = clickerTimeLeft;
        
        if (clickerTimeLeft <= 0) {
            endClickerGame();
        }
    }, 1000);
}

function spawnClickerStar() {
    if (!clickerGameActive) return;
    
    // Remove existing target star if any
    const oldStar = clickerArena.querySelector(".clicker-star");
    if (oldStar) oldStar.remove();
    
    const star = document.createElement("div");
    star.className = "clicker-star";
    star.innerText = "⭐";
    
    // Random absolute positioning within bounds
    const arenaWidth = clickerArena.clientWidth;
    const arenaHeight = clickerArena.clientHeight;
    
    const x = Math.random() * (arenaWidth - 40);
    const y = Math.random() * (arenaHeight - 40);
    
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    
    star.addEventListener("mousedown", () => {
        clickerScore += 1;
        clickerScoreEl.innerText = clickerScore;
        spawnClickerStar();
    });
    
    clickerArena.appendChild(star);
}

function endClickerGame() {
    clickerGameActive = false;
    clearInterval(clickerTimerInterval);
    
    const targetStar = clickerArena.querySelector(".clicker-star");
    if (targetStar) targetStar.remove();
    
    // Compute high scores
    if (clickerScore > state.clickerHighScore) {
        state.clickerHighScore = clickerScore;
        clickerHighEl.innerText = clickerScore;
        saveState();
        
        // Award extra stars for breaking record!
        state.stars += 2;
        openCelebrationModal("⚡ High Score Record!", `Super speedy clicks, Shaki! You set a new record of ${clickerScore} stars clicked in 15 seconds! Earned +2 Stars!`, "Hooray! 💖");
    } else {
        // Flat participation stars if score is good
        if (clickerScore >= 10) {
            state.stars += 1;
            openCelebrationModal("🎮 Game Complete!", `Well played! You caught ${clickerScore} stars. Earned +1 Star!`, "Awesome! ⭐");
        } else {
            openCelebrationModal("🎮 Game Complete!", `You caught ${clickerScore} stars. Keep practicing to earn stars!`, "Try Again 💫");
        }
    }
    
    saveState();
    updateScoreboards();
    
    clickerStartScreen.style.display = "flex";
}

startClickerBtn.addEventListener("click", startClickerGame);


// ------------------------------------------
// 14. CELEBRATION MODAL OVERLAY
// ------------------------------------------
const celebrationModal = document.getElementById("celebration-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalActionBtn = document.getElementById("modal-action-btn");

function openCelebrationModal(title, msg, actionText = "Hooray! 💖") {
    modalTitle.innerText = title;
    modalMessage.innerHTML = msg;
    modalActionBtn.querySelector("span").innerText = actionText;
    
    celebrationModal.classList.add("active");
}

function closeCelebrationModal() {
    celebrationModal.classList.remove("active");
}

modalCloseBtn.addEventListener("click", closeCelebrationModal);
modalActionBtn.addEventListener("click", closeCelebrationModal);
celebrationModal.addEventListener("click", (e) => {
    if (e.target === celebrationModal) closeCelebrationModal();
});


// ------------------------------------------
// 15. INITIALIZATION RUN
// ------------------------------------------

window.addEventListener("load", () => {
    initCanvas();
    updateParticles();
    applyTheme();
    
    // Load modules
    renderRandomQuote();
    loadChallenge();
    loadDreams();
    initStarMap();
    drawWheel();

    // Register Service Worker for PWA with auto-reload on update
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => {
                console.log("[Service Worker] Registered successfully:", reg.scope);
                
                // Trigger reload if a new service worker completes activation
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === "activated") {
                            console.log("[Service Worker] New update activated. Hot-reloading...");
                            window.location.reload();
                        }
                    };
                };
            })
            .catch(err => console.error("[Service Worker] Registration failed:", err));
    }
});
