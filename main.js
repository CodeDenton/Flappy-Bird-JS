// Variables
const gameArea = document.getElementById("gameArea")
const bird = document.getElementById("bird")
const restartButton = document.getElementById("restartButton")
let position = window.innerHeight / 2;
let velocity = 0;

const gravity = 0.2;
const jumpStrength = -4;
const maxFallSpeed = 6;
let alive = true
let runGame = false;

let score = 0
let scoreText = document.getElementById('score')

let pipes = [];


//Spacebar = jump
document.addEventListener('keydown', function (e) {
    if (e.code === "Space") {
        e.preventDefault() // Prevent Scrolling
        if (!runGame) {
            startGame()
        }
        velocity = jumpStrength;
    }

})

// left click = jump
document.addEventListener('mousedown', function (e) {
    if(e.button === 0) {
        e.preventDefault()
        if (!runGame) {
            startGame()
        }
        velocity = jumpStrength;
    }
})

function startGame() {
    runGame = true;
    pipeInterval = setInterval(createPipePair, 2000);
    animationFrame = requestAnimationFrame(gameLoop);
}

function gameLoop() {
    checkCollision()
    movePipes()
    delPipes()
    checkScore()
    if (!alive) return; // break loop if game over

    velocity += gravity;

    if (velocity > maxFallSpeed) velocity = maxFallSpeed;
    position += velocity;

    bird.style.top = position + "px"; // update birds position

    if (position > window.innerHeight * 0.85) endGame();
    else {
        animationFrame = requestAnimationFrame(gameLoop);
    }
}

// Pipes

//create pipepair
function createPipePair() {
    const gap = 150;
    const minHeight = 50;
    const maxHeight = 400;

    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight)
    const bottomHeight = 800 - topHeight - gap;

    const topPipe = document.createElement('div');
    topPipe.className = "pipe top";
    topPipe.style.height = topHeight + "px";
    topPipe.style.left = "1500px";

    const bottomPipe = document.createElement('div');
    bottomPipe.className = "pipe bottom"
    bottomPipe.style.height = bottomHeight + "px";
    bottomPipe.style.top = (topHeight + gap) + "px"
    bottomPipe.style.left = "1500px";

    gameArea.appendChild(topPipe)
    gameArea.appendChild(bottomPipe);
    pipes.push({ topPipe, bottomPipe, hasScored: false });
}

function movePipes() {
    pipes.forEach(pipe => {
        let currentLeftTop = parseFloat(pipe.topPipe.style.left);
        pipe.topPipe.style.left = (currentLeftTop - 1) + "px";

        let currentLeftBottom = parseFloat(pipe.bottomPipe.style.left);
        pipe.bottomPipe.style.left = (currentLeftBottom - 1) + "px";
    });
}
function delPipes() {
    pipes.forEach(pipe => {
        let currentLeftTop = parseFloat(pipe.topPipe.style.left);
        if (currentLeftTop <= -50) {
            pipe.topPipe.remove()
            pipe.bottomPipe.remove()
        }
    })
}

function checkCollision() {
    const birdRect = shrinkRect(bird.getBoundingClientRect())

    pipes.forEach(pipe => {
        const topPipeRect = pipe.topPipe.getBoundingClientRect()
        const bottomPipeRect = pipe.bottomPipe.getBoundingClientRect()
        if (
            birdRect.left < bottomPipeRect.right &&
            birdRect.right > bottomPipeRect.left &&
            birdRect.top < bottomPipeRect.bottom &&
            birdRect.bottom > bottomPipeRect.top
        ) {
            endGame();
        }
        if (
            birdRect.left < topPipeRect.right &&
            birdRect.right > topPipeRect.left &&
            birdRect.top < topPipeRect.bottom &&
            birdRect.bottom > topPipeRect.top
        ) {
            endGame();
        }



    })
}

function checkScore() {
    const birdRect = shrinkRect(bird.getBoundingClientRect())

    pipes.forEach(pipe => {
        const pipeRect = pipe.topPipe.getBoundingClientRect()
        if (
            !pipe.hasScored && birdRect.left > pipeRect.left
        ) {
            pipe.hasScored = true
            score++;
            scoreText.innerHTML = score
        }

    })
}

function restartGame() {
    position = window.innerHeight / 2;
    velocity = 0;
    alive = true
    runGame = false;
    score = 0
    scoreText.innerHTML = score

    //remove pipes
    pipes.forEach(pipe => {
        let currentLeftTop = parseFloat(pipe.topPipe.style.left);
            pipe.topPipe.remove()
            pipe.bottomPipe.remove()
    })

    //empty the array
    pipes = [];
    bird.style.top = position + "px";
    restartButton.style.display = "none";

}

function shrinkRect(rect, shrinkAmount = 78) {
    return {
        top: rect.top + shrinkAmount + 10,
        bottom: rect.bottom - shrinkAmount - 10,
        left: rect.left + shrinkAmount,
        right: rect.right - shrinkAmount
    };
}

function endGame() {
    alive = false;
    clearInterval(pipeInterval)
    restartButton.style.display = "block";
}

