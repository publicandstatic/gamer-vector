var canvas = document.getElementById('background-сanvas');
var context = canvas.getContext('2d');
var colors = ["#00bfcb", "#18d3bc", "#5b82c8", "#3396cf"];
var fps = 15;
var now;
var then = Date.now();
var num = 2;
var delta;
var tamanho = 50;
var ismobile = false;
var varpi = 2 * Math.PI;
var interval = 1000/fps;
var objforDraw = new Array();

document.addEventListener("DOMContentLoaded", function() {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window
                .webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback,
                    1000 / fps)
            }
    })();
    window.cancelRequestAnimFrame = (function() {
        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
    })();
    var ShadowObject = function(color) {
        this.x = ((Math.random() * canvas.width) + 10);
        this.y = ((Math.random() * canvas.height) + 10);
        this.color = color;
        this.size = tamanho;
        this.dirX = Math.random() < 0.5 ? -1 : 1;
        this.dirY = Math.random() < 0.5 ? -1 : 1;
        this.checkIsOut = function() {
            if ((this.x > canvas.width + (this.size /
                2)) || (this.x < 0 - (this.size /
                2))) {
                this.dirX = this.dirX * -1
            };
            if ((this.y > canvas.height + (this.size /
                2)) || (this.y < 0 - (this.size /
                2))) {
                this.dirY = this.dirY * -1
            }
        };
        this.move = function() {

            this.x += this.dirX*2;
            this.y += this.dirY*2

        }
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var len = objforDraw.length;
        for (i = 0; i < len; i++) {
            context.beginPath();
            context.arc(objforDraw[i].x, objforDraw[i].y, objforDraw[i].size, 0, varpi, false);
            context.fillStyle = objforDraw[i].color;
            context.shadowColor = objforDraw[i].color;
            if(ismobile == false){
                context.shadowBlur = 50;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }
            context.fill();
            objforDraw[i].checkIsOut();
            objforDraw[i].move()
        }
    };

    function animloop() {
        requestAnimFrame(animloop);
        now = Date.now();
        delta = now - then;
        if (delta > interval) {
            draw();
            then = now - (delta % interval)
        }
    };
    document.body.onload = function(e) {
        for (i = 0; i < colors.length * num; i++) {
            var color = ((i >= colors.length) ? colors[(i -
                colors.length)] : colors[i]);
            objforDraw.push(new ShadowObject(color))
        };
        animloop()
    };
});

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function normalizeHash(hash, min, max) {
    return min + (Math.abs(hash) % (max - min + 1));
}

function popup() {
    const modal = new bootstrap.Modal(document.getElementById('fullscreenModal'));

    modal.show();
    const duration = Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;

    const bar = document.querySelector('.progress-bar');

    const durationSec = duration / 1000;

    bar.style.animation = `loadingBar ${durationSec}s linear forwards`;

    const messages = [
        "Перечитую важливі опінії...",
        "Дивлюся в майбутнє...",
        "Формую вектор ґеймера...",
        "Передивляюсь фолови в Х...",
        "Аналізую участь в срачах...",
        "Аналізую твоє ставлення до ремейків...",
        "Вивчаю глибину задротства...",
        "Оцінюю вплив дитинства на вибір ігор...",
        "Читаю всі твіти з тегом #ігролад...",
        "Шукаю всі твіти з тегом #дієвидло...",
        "Викликаю дух Міядзакі..."
    ];

    const loadingEl = document.getElementById('loading');
    const minDelay = 1500;
    const maxDelay = 2500;
    let elapsed = 0;

    function showRandomMessage() {
        if (elapsed >= duration) return;

        const msg = messages[Math.floor(Math.random() * messages.length)];
        loadingEl.textContent = msg;

        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        elapsed += delay;

        setTimeout(showRandomMessage, delay);
    }

    showRandomMessage();

    setTimeout(() => {
        generate();
        modal.hide();
    }, duration);
}

function generate() {
    let rawInput = document.getElementById('nickname').value.trim();

    let nickname = rawInput
        .replace(/^@/, '')
        .replace(/^https?:\/\/(x|twitter)\.com\//, '')
        .replace(/^https?:\/\/bsky\.app\/profile\//, '')
        .replace(/\/.*$/, '')
        .trim();
    if (!nickname) return;

    const x = normalizeHash(hashCode(nickname.toLowerCase()) * 10, -100, 100);
    const y = normalizeHash(hashCode(nickname.toLowerCase()) * 5, -100, 100);

    const proYBottom = Math.round(50 + (-y / 2));
    const proYTop = 100 - proYBottom;
    const proXRight = Math.round(50 + (x / 2));
    const proXLeft = 100 - proXRight;

    const map = document.getElementById('map');
    const avatar = document.getElementById('avatar');
    const centerX = map.clientWidth / 2;
    const centerY = map.clientHeight / 2;
    const offsetX = (x / 100) * (map.clientWidth / 2);
    const offsetY = (y / 100) * (map.clientHeight / 2);
    avatar.style.display = `block`;
    avatar.style.left = `${centerX + offsetX}px`;
    avatar.style.top = `${centerY - offsetY}px`;
    avatar.src = `https://unavatar.io/x/${nickname}`;
    avatar.onerror = () => {
        avatar.src = 'https://unavatar.io/twitter';
    };

    document.getElementById('yTop-bar').style.width = `${proYTop}%`;
    document.getElementById('yTop-placement').innerText = `${proYTop}%`;
    document.getElementById('yBottom-bar').style.width = `${proYBottom}%`;
    document.getElementById('yBottom-placement').innerText = `${proYBottom}%`;
    document.getElementById('xLeft-bar').style.width = `${proXLeft}%`;
    document.getElementById('xLeft-placement').innerText = `${proXLeft}%`;
    document.getElementById('xRight-bar').style.width = `${proXRight}%`;
    document.getElementById('xRight-placement').innerText = `${proXRight}%`;
    document.getElementById('placement').innerText = `#${normalizeHash(hashCode(nickname.toLowerCase() + '_miyazaki'), 1, 1000)}`;
    const placement = document.getElementsByClassName('placement')[0];
    placement.style.display = `block`;
}

function getPrimes(n) {
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;

    for (let i = 2; i * i <= n; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }

    return sieve
        .map((isPrime, number) => isPrime ? number : null)
        .filter(Boolean);
}

function test() {
    let primes = getPrimes(500);
    for (let i = 1; i < 500; i++) {
        const x1 = normalizeHash(hashCode('test1') *i, -100, 100);
        const x2 = normalizeHash(hashCode('test2') *i, -100, 100);
        if (x1 > 60 && x2 < -60) {
            console.log(i, x1, x2);
        }
    }
    for (let i = 0; i < primes.length; i++) {
        const x1 = normalizeHash(hashCode('test1') * primes[i], -100, 100);
        const x2 = normalizeHash(hashCode('test2') * primes[i], -100, 100);
        if (x1 > 60 && x2 < -60) {
            console.log(primes[i], x1, x2);
        }
    }
}