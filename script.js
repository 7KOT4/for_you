const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Ресайз холста под экран
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particlesArray = [];

// Класс для частиц взрыва
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        // Случайное направление разлета
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.color = Math.random() > 0.5 ? '#e6c687' : '#ffffff';
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        if (particlesArray[i].alpha <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    if (particlesArray.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}

// Логика клика и переключения интерфейса
document.getElementById('trigger-core').addEventListener('click', function(e) {
    const trigger = document.getElementById('trigger-core');
    const card = document.getElementById('main-card');
    const music = document.getElementById('bg-music');

    // Получаем координаты клика для взрыва частиц
    const rect = trigger.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    // Генерируем частицы
    for (let i = 0; i < 80; i++) {
        particlesArray.push(new Particle(clickX, clickY));
    }
    animateParticles();

    // Запуск звука
    music.play().catch(() => console.log("Музыка ждет ручного овнера"));

    // Плавное исчезновение триггера и появление карточки
    trigger.style.opacity = '0';
    trigger.style.transform = 'scale(0.8)';

    setTimeout(() => {
        trigger.classList.add('hidden');
        card.classList.remove('hidden');

        // Микротаску для триггера CSS анимации перехода
        setTimeout(() => {
            card.classList.add('reveal');
        }, 50);
    }, 400);
});