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

document.addEventListener("click", function(v) {
    if (state.cur == 0) {
        state.cur = 1;
    } else if (state.cur == 1) {
        bird.flap();
    } else {
        state.cur = 0;
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
    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}


// get the bird animation
const bird = {
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}  
    ],
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    frame: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    rotation: 0,
    draw: function() {
        let fly = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, fly.sX, fly.sY, this.w, this.h, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
        ctx.restore();
    },
    flap: function() {
        this.speed = - this.jump;
    },
    update: function() {
        // make bird flow slow at start, and speeding when game starts
        this.period = state.cur == state.begin ? 10 : 5;
        // for each period of frames, the bird should change its animation
        if (frames % this.period == 0) {
            this.frame++;
        }
        this.frame = this.frame % this.animation.length;
        if (state.cur == state.begin) {
            this.y = 150;
            this.speed = 0;
        } else {
            this.speed = this.speed + this.gravity;
            this.y = this.y + this.speed;
            if (this.y + this.h >= canvas.height - floor.h) {
                this.y = canvas.height - floor.h - 1/2 * this.h;
                state.cur = state.end;
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
    y: canvas.height - 112,
    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }

}

const ready = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width/2 - 173/2,
    y: canvas.height/2 - 152/2,
    draw: function() {
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
    x: canvas.width/2 - 225/2,
    y: canvas.height/2 - 202/2,
    draw: function() {
        if (state.cur == 2) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    floor.draw();
    bird.draw();
    ready.draw();
    gameOver.draw();
}

function update() {
   bird.update();
}

function loop() {
    update();
    draw();
    // track each frame 
    frames++;
    requestAnimationFrame(loop);
}
console.log("aaa")
loop();
