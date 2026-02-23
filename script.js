const card = document.getElementById('card');

function handleMove(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation relative to center (max 15 degrees)
    const rotateX = ((y / rect.height) - 0.5) * 30;
    const rotateY = ((x / rect.width) - 0.5) * 30;

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
}

function reset() {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
}

card.addEventListener('mousemove', handleMove);
card.addEventListener('mouseleave', reset);

// Download functionality
const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', () => {
    // Temporarily remove the transform so the screenshot is flat
    const currentTransform = card.style.transform;
    card.style.transform = 'none';

    // Remove focus to avoid focus ring in image
    document.activeElement.blur();

    html2canvas(card, { backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'business_card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Restore transform
        card.style.transform = currentTransform;
    });
});

// Improve editing UX — prevent losing focus when clicking on card
card.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('field')) {
        e.target.focus();
    }
});

// Gradient color controls with circle updates
const colorStart = document.getElementById('colorStart');
const colorMid = document.getElementById('colorMid');
const colorEnd = document.getElementById('colorEnd');

const circleStart = document.getElementById('circleStart');
const circleMid = document.getElementById('circleMid');
const circleEnd = document.getElementById('circleEnd');

function updateGradient() {
    card.style.background = `linear-gradient(135deg, ${colorStart.value}, ${colorMid.value}, ${colorEnd.value})`;
    circleStart.style.backgroundColor = colorStart.value;
    circleMid.style.backgroundColor = colorMid.value;
    circleEnd.style.backgroundColor = colorEnd.value;
}

// Clicking the circle triggers the hidden input color picker
[circleStart, circleMid, circleEnd].forEach((circle, i) => {
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', () => {
        if (i === 0) colorStart.click();
        else if (i === 1) colorMid.click();
        else if (i === 2) colorEnd.click();
    });
});

colorStart.addEventListener('input', updateGradient);
colorMid.addEventListener('input', updateGradient);
colorEnd.addEventListener('input', updateGradient);

updateGradient();

// Font family control
const fontFamilySelect = document.getElementById('fontFamily');

fontFamilySelect.addEventListener('change', () => {
    card.style.fontFamily = fontFamilySelect.value;
});

// Initialize font family
card.style.fontFamily = fontFamilySelect.value;

// Logo upload handler
const logoUpload = document.getElementById('logoUpload');
const logoContainer = document.getElementById('logoContainer');

logoUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        let img = logoContainer.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            logoContainer.appendChild(img);
        }
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
});