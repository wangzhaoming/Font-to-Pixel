// load font
document.fonts.load(`12px pixel7`, "测试").catch((e) => {
  console.error(e);
});
document.fonts.load(`12px pixel8`, "测试").catch((e) => {
  console.error(e);
});
document.fonts.load(`12px pixel10`, "测试").catch((e) => {
  console.error(e);
});
document.fonts.load(`12px pixel12`, "测试").catch((e) => {
  console.error(e);
});
document.fonts.load(`12px pixel16`, "测试").catch((e) => {
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
  const bgEmojiTxt = document.querySelector('#bg');
  const bgEmojiTrigger = document.querySelector('.emoji-button-bg');

  const windowWidth = window.innerWidth;
  const options = {};
  if (windowWidth < 768) {
    options.position = {
      left: '0px',
      top: '100px'
    };
  }

  const bgEmojiPicker = createPopup(options, {
    referenceElement: bgEmojiTrigger,
    triggerElement: bgEmojiTrigger,
    position: 'right-end'
  });

  bgEmojiTrigger.addEventListener('click', () => {
    bgEmojiPicker.toggle();
  });

  bgEmojiPicker.addEventListener('emoji:select', (selection) => {
    bgEmojiTxt.value = selection.emoji;
  });

  const fgEmojiTxt = document.querySelector('#fg');
  const fgEmojiTrigger = document.querySelector('.emoji-button-fg');

  const fgEmojiPicker = createPopup(options, {
    referenceElement: fgEmojiTrigger,
    triggerElement: fgEmojiTrigger,
    position: 'right-end'
  });

  fgEmojiTrigger.addEventListener('click', () => {
    fgEmojiPicker.toggle();
  });

  fgEmojiPicker.addEventListener('emoji:select', (selection) => {
    fgEmojiTxt.value = selection.emoji;
  });
});

// copy
function copy() {
  const text = document.getElementById('ta').innerText;

  if (!text) {
    Toastify({
      text: "Please draw image first.",
      duration: 2000
    }).showToast();
    return;
  }

  navigator.clipboard.writeText(text);
  Toastify({
    text: "Emoji Copied.",
    duration: 2000
  }).showToast();
}

// canvas
const canvas = document.getElementById('content');

function draw() {
  //获得 2d 上下文对象
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const text = document.getElementById('in').value;
  const bgtext = document.getElementById('bg').value;
  const fgtext = document.getElementById('fg').value;
  const thd = document.getElementById('thd').value;
  const size = parseInt(document.querySelector('input[name="size"]:checked').value);
  const direction = document.querySelector('input[name="direction"]:checked').value;

  let len = 0;
  for (let i = 0; i< text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 256) {
      // ascii字符仅占半宽
      if (size === 8) {
        len += 0.625;
      }
      else {
        len += 0.5;
      }
    }
    else {
      len++;
    }
  }


  let colPixels = len * size; // 横向时英文字符仅占半宽
  let rowPixels = 1 * size;
  let textToDraw = [text];
  if (direction === 'v') {
    rowPixels = text.length * size; // 纵向中英文同等处理
    colPixels = 1 * size;
    textToDraw = text.split('')
  }

  canvas.width = colPixels;
  canvas.height = rowPixels;

  const containerWidth = canvas.parentElement.offsetWidth;
  canvas.style.height = canvas.height * 3 + 'px';
  canvas.style.width = canvas.width * 3 + 'px';
  if (canvas.width * 3 > containerWidth) {
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = canvas.height / canvas.width * containerWidth + 'px';
  }

  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, colPixels, rowPixels);


  ctx.font = `${size}px pixel${size}`;
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.textBaseline = 'top';

  for (let i = 0; i < textToDraw.length; i++) {
    ctx.fillText(textToDraw[i], 0, i * size);
  }

  const myImageData = ctx.getImageData(0, 0, colPixels, rowPixels);
  console.log(myImageData);
  let v = '';
  for (let i = 0; i < rowPixels; i++) {
    for (let j = 0; j < colPixels; j++) {
      const n = i * colPixels * 4 + j * 4;
      v += myImageData.data[n] > thd ? fgtext : bgtext;
    }
    v += '\n';
  }
  console.log(v);
  document.getElementById("ta").innerText = v;
}