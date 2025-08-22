// NOME: selezione lettere in ordine, elimina una lettera, conferma
const lettersDiv = document.getElementById('letters');
const selectBtn = document.getElementById('select-letter');
const delBtn = document.getElementById('del-letter');
const nameOutput = document.getElementById('name-output');
const confirmNameBtn = document.getElementById('confirm-name');
const nameArea = document.getElementById('name-area');
let name = '';
let nameStep = 0;
let currentLetter = 'A';
let interval;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let letterIndex = 0;
let nameConfirmed = false;

function startLetterScroll() {
    letterIndex = 0;
    interval = setInterval(() => {
        currentLetter = alphabet[letterIndex];
        lettersDiv.textContent = currentLetter;
        letterIndex = (letterIndex + 1) % alphabet.length;
    }, 250);
}
startLetterScroll();

selectBtn.onclick = () => {
    if (nameConfirmed) return;
    clearInterval(interval);
    name += currentLetter;
    nameOutput.textContent = name;
    nameStep++;
    if (nameStep < 6) {
        setTimeout(() => {
            startLetterScroll();
        }, 400);
    } else {
        selectBtn.disabled = true;
        lettersDiv.textContent = '';
    }
};

delBtn.onclick = () => {
    if (nameConfirmed) return;
    if (name.length > 0) {
        name = name.slice(0, -1);
        nameOutput.textContent = name;
        nameStep--;
        if (nameStep < 6 && selectBtn.disabled) {
            selectBtn.disabled = false;
            startLetterScroll();
        }
    }
};

confirmNameBtn.textContent = "Conferma Nome";
confirmNameBtn.onclick = () => {
    if (!nameConfirmed) {
        nameConfirmed = true;
        selectBtn.disabled = true;
        delBtn.disabled = true;
        lettersDiv.textContent = '';
        confirmNameBtn.textContent = "Modifica Nome";
        nameArea.classList.add('confirmed');
    } else {
        nameConfirmed = false;
        selectBtn.disabled = false;
        delBtn.disabled = false;
        confirmNameBtn.textContent = "Conferma Nome";
        nameArea.classList.remove('confirmed');
        if (nameStep < 6) startLetterScroll();
    }
};

// COGNOME: ruota con tutte le lettere, elimina una lettera, conferma
const wheelDiv = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-wheel');
const delSurnameBtn = document.getElementById('del-surname-letter');
const surnameOutput = document.getElementById('surname-output');
const confirmSurnameBtn = document.getElementById('confirm-surname');
const surnameArea = document.getElementById('surname-area');
const wheelLetters = alphabet.split('');
const wheelSize = wheelLetters.length;
let surname = '';
let surnameStep = 0;
let surnameConfirmed = false;

function drawWheel(selectedIdx = null) {
    wheelDiv.innerHTML = '';
    const center = 70;
    const radius = 45;
    wheelLetters.forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.position = 'absolute';
        span.style.left = `${center + radius * Math.cos((2 * Math.PI * i) / wheelSize - Math.PI / 2)}px`;
        span.style.top = `${center + radius * Math.sin((2 * Math.PI * i) / wheelSize - Math.PI / 2)}px`;
        span.style.transform = 'translate(-50%, -50%)';
        span.style.fontSize = i === selectedIdx ? '1.5rem' : '0.8rem';
        span.style.color = i === selectedIdx ? '#ffd700' : '#222';
        wheelDiv.appendChild(span);
    });
    wheelDiv.style.position = 'relative';
}

function spinWheel() {
    if (surnameConfirmed) return;
    spinBtn.disabled = true;
    let spins = 18 + Math.floor(Math.random() * 8);
    let idx = 0;
    let spinInterval = setInterval(() => {
        idx = (idx + 1) % wheelSize;
        drawWheel(idx);
        spins--;
        if (spins <= 0) {
            clearInterval(spinInterval);
            surname += wheelLetters[idx];
            surnameOutput.textContent = surname;
            surnameStep++;
            spinBtn.disabled = false;
            if (surnameStep >= 6) {
                spinBtn.disabled = true;
                wheelDiv.innerHTML = '';
            }
        }
    }, 120);
}

spinBtn.onclick = spinWheel;

delSurnameBtn.onclick = () => {
    if (surnameConfirmed) return;
    if (surname.length > 0) {
        surname = surname.slice(0, -1);
        surnameOutput.textContent = surname;
        surnameStep--;
        if (surnameStep < 6 && spinBtn.disabled) {
            spinBtn.disabled = false;
            drawWheel();
        }
    }
};

confirmSurnameBtn.textContent = "Conferma Cognome";
confirmSurnameBtn.onclick = () => {
    if (!surnameConfirmed) {
        surnameConfirmed = true;
        spinBtn.disabled = true;
        delSurnameBtn.disabled = true;
        wheelDiv.innerHTML = '';
        confirmSurnameBtn.textContent = "Modifica Cognome";
        surnameArea.classList.add('confirmed');
    } else {
        surnameConfirmed = false;
        spinBtn.disabled = false;
        delSurnameBtn.disabled = false;
        confirmSurnameBtn.textContent = "Conferma Cognome";
        surnameArea.classList.remove('confirmed');
        drawWheel();
    }
};

drawWheel();

// DATA DI NASCITA: sistema solare, conferma
const canvas = document.getElementById('solar-canvas');
const ctx = canvas.getContext('2d');
const dateOutput = document.getElementById('date-output');
const confirmDateBtn = document.getElementById('confirm-date');
const solarArea = document.querySelector('.solar-area');
const ellipse = { cx: 200, cy: 100, rx: 150, ry: 70 };
const sun = { x: ellipse.cx - ellipse.rx + 30, y: ellipse.cy, r: 18 };
const earth = { r: 12 };
const stars = Array.from({length: 40}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    s: Math.random() * 1.5 + 0.5
}));
let dayOfYear = 1;
let year = 2000;
const angleOffset = Math.PI;
let isDragging = false;
let lastDayOfYear = null;
let dateConfirmed = false;

function drawSolar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stelline
    ctx.save();
    ctx.globalAlpha = 0.7;
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.s, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
    });
    ctx.restore();

    // Ellisse (orbita)
    ctx.beginPath();
    ctx.ellipse(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sole
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.r, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffb300";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Terra (segue il mouse, senso inverso per la data)
    const angle = angleOffset - ((2 * Math.PI * (dayOfYear - 1)) / 365);
    const ex = ellipse.cx + ellipse.rx * Math.cos(angle);
    const ey = ellipse.cy + ellipse.ry * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(ex, ey, earth.r, 0, 2 * Math.PI);
    ctx.fillStyle = "#2196f3";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Mano (hover)
    if (isDragging) {
        ctx.beginPath();
        ctx.arc(ex, ey, earth.r + 8, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function getDateFromDay(year, day) {
    // Calcola la data reale dal giorno dell'anno
    const date = new Date(year, 0, day);
    const month = date.getMonth();
    const nextMonth = new Date(year, month + 1, 0);
    let maxDay = nextMonth.getDate();
    let dayOfMonth = date.getDate();
    if (dayOfMonth > maxDay) dayOfMonth = maxDay;
    return `${String(dayOfMonth).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
}

function updateDateOutput() {
    dateOutput.textContent = getDateFromDay(year, dayOfYear);
}

canvas.addEventListener('mousedown', function(e) {
    if (dateConfirmed) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const angle = angleOffset - ((2 * Math.PI * (dayOfYear - 1)) / 365);
    const ex = ellipse.cx + ellipse.rx * Math.cos(angle);
    const ey = ellipse.cy + ellipse.ry * Math.sin(angle);
    const dist = Math.sqrt((mx - ex) ** 2 + (my - ey) ** 2);
    if (dist < earth.r + 10) {
        isDragging = true;
        lastDayOfYear = dayOfYear;
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging && !dateConfirmed) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let dx = mx - ellipse.cx;
        let dy = my - ellipse.cy;
        let angle = angleOffset - Math.atan2(dy / ellipse.ry, dx / ellipse.rx);
        if (angle < 0) angle += 2 * Math.PI;

        let newDayOfYear = Math.round((angle / (2 * Math.PI)) * 365) + 1;
        if (newDayOfYear < 1) newDayOfYear = 1;
        if (newDayOfYear > 365) newDayOfYear = 365;

        // Cambio anno se si supera il punto di partenza
        if (lastDayOfYear <= 30 && newDayOfYear >= 335) {
            year--;
            if (year < 1900) year = 1900;
        }
        if (lastDayOfYear >= 335 && newDayOfYear <= 30) {
            year++;
            if (year > 2100) year = 2100;
        }

        dayOfYear = newDayOfYear;
        lastDayOfYear = dayOfYear;
        updateDateOutput();
        drawSolar();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
    drawSolar();
});
canvas.addEventListener('mouseleave', function() {
    isDragging = false;
    drawSolar();
});

confirmDateBtn.textContent = "Conferma Data";
confirmDateBtn.onclick = () => {
    if (!dateConfirmed) {
        dateConfirmed = true;
        confirmDateBtn.textContent = "Modifica Data";
        solarArea.classList.add('confirmed');
    } else {
        dateConfirmed = false;
        confirmDateBtn.textContent = "Conferma Data";
        solarArea.classList.remove('confirmed');
    }
};

updateDateOutput();
drawSolar();

// Bottone "Sì" che scappa
window.onload = function() {
    const finishBtn = document.getElementById('finish-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalWindow = document.getElementById('modal-window');
    const modalData = document.getElementById('modal-data');
    const modalYes = document.getElementById('modal-yes');
    const modalNo = document.getElementById('modal-no');
    const thanksOverlay = document.getElementById('thanks-overlay');

    finishBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        modalData.innerHTML = `
            <b>Nome:</b> ${nameConfirmed ? name : '-'}<br>
            <b>Cognome:</b> ${surnameConfirmed ? surname : '-'}<br>
            <b>Data di nascita:</b> ${dateConfirmed ? getDateFromDay(year, dayOfYear) : '-'}
        `;
    });

    modalYes.addEventListener('mouseenter', () => {
        modalYes.style.position = 'absolute';
        modalYes.style.left = (Math.random() * 60 + 20) + '%';
        modalYes.style.top = (Math.random() * 40 + 30) + '%';
        modalWindow.style.position = 'relative';
    });

    modalYes.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        thanksOverlay.style.display = 'flex';
        modalYes.style.position = 'static';
        modalYes.style.left = '';
        modalYes.style.top = '';
    });

    modalNo.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        finishBtn.style.display = 'block';
        modalYes.style.position = 'static';
        modalYes.style.left = '';
        modalYes.style.top = '';
    });
};