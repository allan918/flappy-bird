// get the canvas
const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext('2d');
// creage a new image
const sprite = new Image();
const DEGREE = Math.PI / 180;
sprite.src = "img/sprite.png";

let frames = 0;
const state = {
    cur: 0,
    begin: 0,
    game: 1,
    end: 2
}

const restart = {
    x: 120,
    y: 310,
    w: 83,
    h: 29
}

//get audio
const score_it = new Audio()
score_it.src = "audio/sfx_point.wav";

const flap = new Audio()
flap.src = "audio/sfx_flap.wav";

const hit = new Audio()
hit.src = "audio/sfx_hit.wav";

const swooshing = new Audio()
swooshing.src = "audio/sfx_swooshing.wav";

const die = new Audio()
die.src = "audio/sfx_die.wav";


document.addEventListener("click", function (v) {
    if (state.cur == 0) {
        state.cur = 1;

        //serve as a flag to avoid repeating because of constant updating
        bird.live = 1;
        swooshing.play();
    } else if (state.cur == 1) {
        bird.flap();
        flap.play();
    } else {
        // handel the scrolling and the click start position
        let rect = canvas.getBoundingClientRect();
        let clickX = v.clientX - rect.left;
        let clickY = v.clientY - rect.top;
        if (clickX >= restart.x && restart.x + restart.w >= clickX
            && clickY >= restart.y && clickY <= restart.y +
            restart.h) {
            state.cur = 0;
            score.value = 0;
        }
    }
});

// get the background image
const background = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,
    dx: 2, // speed that is moving each frame
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (state.cur == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2)
        }
    }
}


// get the bird animation
const bird = {
    radius: 12,
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
    ],
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    frame: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.5,
    rotation: 0,
    live: 1, 
    draw: function () {
        let fly = this.animation[this.frame];
        // for the rotation of the bird
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, fly.sX, fly.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();
    },
    flap: function () {
        this.speed = - this.jump;
    },
    update: function () {
        // make bird flow slow at start, and speeding when game starts
        this.period = state.cur == state.begin ? 10 : 5;
        // for each period of frames, the bird should change its animation
        if (frames % this.period == 0) {
            this.frame++;
        }
        this.frame = this.frame % this.animation.length;
        if (state.cur == state.begin) {
            //reset the value to initial
            this.y = 150;
            this.speed = 0;
            this.rotation = 0;
        } else {

            // prepare the speed and location for next frame
            this.speed = this.speed + this.gravity;
            this.y = this.y + this.speed;

            // when games over
            if (this.y + this.h >= canvas.height - floor.h) {
                this.y = canvas.height - floor.h - 1 / 2 * this.h;
                if (this.live == 1) {
                    die.play();
                }
                this.live = 0;
                state.cur = state.end;
                this.frame = 1;
            }


            if (this.speed >= this.jump) { //falling
                this.rotation = 90 * DEGREE;

            } else {
                this.rotation = -25 * DEGREE; // upward
            }
        }
    }
}

const floor = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    dx: 3,
    y: canvas.height - 112,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    update: function () {
        if (state.cur == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2)
        }
    }

}

const ready = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width / 2 - 173 / 2,
    y: canvas.height / 2 - 152 / 2,
    draw: function () {
        if (state.cur == 0) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: canvas.width / 2 - 225 / 2,
    y: canvas.height / 2 - 202 / 2,
    draw: function () {
        if (state.cur == 2) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,
    draw: function () {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        if (state.cur == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, canvas.width / 2, 50);
            ctx.strokeText(this.value, canvas.width / 2, 50);
        } else if (state.cur == state.end) {
            ctx.font = "30px Teko"
            ctx.fillText(this.value, 225, 235);
            ctx.strokeText(this.value, 225, 235);
            ctx.fillText(this.best, 225, 277);
            ctx.strokeText(this.best, 225, 277);
        }
    }
}

const pipes = {
    bottom: {
        sX: 502,
        sy: 0,
    },
    top: {
        sx: 553,
        sy: 0
    },
    w: 53,
    h: 400,
    gap: 95,
    dx: 2,
    position: [],
    maxY: -150,
    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let pos = this.position[i];
            let topP = pos.y;
            let botP = pos.y + this.h + this.gap;

            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sy, this.w, this.h, pos.x, botP, this.w, this.h);
            ctx.drawImage(sprite, this.top.sx, this.top.sy, this.w, this.h, pos.x, topP, this.w, this.h);
        }
    },
    update: function () {
        // if (state.cur != state.game) return;
        if (frames % 100 == 0 & (state.cur == state.game)) {
            // calculate a random start y for the top pipes
            this.position.push(
                {
                    x: canvas.width,
                    y: this.maxY * (Math.random() + 1)
                }
            )
            console.log("aaaaaa");
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;
            //bot Y
            let bottomPos = p.y + this.h + this.gap;
            // collision
            // if in the pip, then fail
            if (
                // touch inside of top pipe, check 4 lines
                (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y
                    && bird.y - bird.radius < p.y + this.h)
                ||
                // touch the bottom pipe
                (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPos
                    && bird.y - bird.radius < bottomPos + this.h)

            ) {
                state.cur = state.end;
                hit.play();
                console.log("touched");
            }
            //remove the past pipe
            if (p.x + this.w <= 0) {
                this.position.shift();
                score_it.play();
                score.value += 1;
                score.best = Math.max(score.best, score.value);
                localStorage.setItem("best", score.best);
            }
        }
        if (state.cur == state.end) {
            this.position.length = 0;
        }
    }
}

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    pipes.draw();
    floor.draw();
    bird.draw();
    ready.draw();
    gameOver.draw();
    score.draw();

}

function update() {
    bird.update();
    background.update();
    floor.update();
    pipes.update();
}

function loop() {
    update();
    draw();
    // track each frame 
    frames++;
    requestAnimationFrame(loop);
}
loop();
