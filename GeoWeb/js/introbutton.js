let container = document.querySelector('.container');
let button = document.querySelector('.button');
let buttonSide = document.querySelectorAll('.button_side');
let buttonGlow = document.querySelector('.button_glow');

let rotationForce = 0.016;

let buttonPos = {
    x: container.offsetLeft + button.offsetWidth / 3,
    y: container.offsetTop + button.offsetHeight / 2
}

let mouse = {
    x: 0,
    y: 0
}

let rotation = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    rotation.x = (mouse.y - buttonPos.y) / (window.innerHeight * rotationForce);
    rotation.y = (mouse.x - buttonPos.x) / (window.innerWidth * rotationForce);

    button.style.transform = 'rotateX(' + rotation.x + 'deg)' + 'rotateY(' + rotation.y + 'deg)';
    buttonGlow.style.transform = 'rotateX(' + -1 * rotation.x + 'deg)' + 'rotateY(' + -1 * rotation.y + 'deg)';
})