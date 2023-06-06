// load font
document.fonts.load(`12px pixel`, "测试").catch((e) => {
    console.error(e);
});

// create slider
const
    range = document.getElementById('thd'),
    rangeV = document.getElementById('rangeV'),
    setValue = (e) => {
        const
            newValue = Number((range.value - range.min) * 100 / (range.max - range.min)),
            newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span>${range.value}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;

        if (e.type === 'input') {
            draw();
        }
    };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);

// create emoji selector
const { createPopup } = window.picmoPopup;

document.addEventListener('DOMContentLoaded', () => {
  const emoji = document.querySelector('#bg');
  const trigger = document.querySelector('.emoji-button');

  const picker = createPopup({}, {
    referenceElement: trigger,
    triggerElement: trigger,
    position: 'right-end'
  });

  trigger.addEventListener('click', () => {
    picker.toggle();
  });

  picker.addEventListener('emoji:select', (selection) => {
    emoji.value = selection.emoji;
  });

  const emoji1 = document.querySelector('#fg');
  const trigger1 = document.querySelector('.emoji-button1');

  const picker1 = createPopup({}, {
    referenceElement: trigger1,
    triggerElement: trigger1,
    position: 'right-end'
  });

  trigger1.addEventListener('click', () => {
    picker1.toggle();
  });

  picker1.addEventListener('emoji:select', (selection) => {
    emoji1.value = selection.emoji;
  });
});


// canvas
const canvas = document.getElementById('content');
canvas.width = 240;
canvas.height = 12;

function draw() {
    //获得 2d 上下文对象
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const text = document.getElementById('in').value;
    const bgtext = document.getElementById('bg').value;
    const fgtext = document.getElementById('fg').value;
    const thd = document.getElementById('thd').value;
    const l = text.length * 12;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, l, 12);


    ctx.font = "12px pixel"
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.textBaseline = 'top';

    ctx.fillText(text, 0, 0);

    const myImageData = ctx.getImageData(0, 0, l, 12);
    console.log(myImageData);
    let v = '';
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < l; j++) {
            const n = i * l * 4 + j * 4;
            v += myImageData.data[n] > thd ? fgtext : bgtext;
        }
        v += '\n';
    }
    console.log(v);
    document.getElementById("ta").innerText = v;
}