let mouseInterval = null;
let mouseLocation = '';
let mouseEvent = null;

export function init() {
  // remove context menu
  // window.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // browser based events
  window.addEventListener('resize', () => onWindowResize());

  // mouse events
  window.addEventListener('wheel', (e) => onMouseWheel(e), false); // IE9, Chrome, Safari, Opera
  window.addEventListener('mousedown', (e) => onMouseDown(e));
  window.addEventListener('mouseup', (e) => onMouseUp(e));
  window.addEventListener('mousemove', (e) => onMouseMove(e));
  window.addEventListener('dblclick', (e) => onMouseDoubleClick(e));
  window.addEventListener('click', (e) => onMouseClick(e));

  // keyboard events
  document.addEventListener('keydown', (e) => onKeyDown(e));
  document.addEventListener('keyup', (e) => onKeyUp(e));
  document.addEventListener('keypress', (e) => onKeyPress(e));
}

function onWindowResize() {

}

function onMouseWheel(e) {
  if (e.deltaY < 0) {
    // events.emit('network/send', 'player/levitate', 'in');
  } else {
    // events.emit('network/send', 'player/levitate', 'out');
  }
}

function onMouseDown(e) {
  if (e) {
    mouseEvent = e;
  }
  mouseInterval = setInterval(() => onMouseClick(mouseEvent), 1000 / 4);
}

function onMouseUp(e) {
  clearInterval(mouseInterval);
}

function onMouseMove(e) {
  // break up area into 6
  // topLeft, topCenter, topRight, centerLeft, centerCenter, centerRight, bottomLeft, bottomCenter, and bottomRight
  var xLeft = e.clientX > 0 && e.clientX < window.innerWidth / 3;
  var xCenter = e.clientX > window.innerWidth / 3 && e.clientX < window.innerWidth - (window.innerWidth / 3);
  var xRight = e.clientX > window.innerWidth - (window.innerWidth / 3) && e.clientX < window.innerWidth;

  var yTop = e.clientY > 0 && e.clientY < window.innerHeight / 3;
  var yCenter = e.clientY > window.innerHeight / 3 && e.clientY < window.innerHeight - (window.innerHeight / 3);
  var yBottom = e.clientY > window.innerHeight - (window.innerHeight / 3) && e.clientY < window.innerHeight;

  var topLeft = xLeft && yTop;
  var topCenter = xCenter && yTop;
  var topRight = xRight && yTop;

  var centerLeft = xLeft && yCenter;
  var centerCenter = xCenter && yCenter;
  var centerRight = xRight && yCenter;

  var bottomLeft = xLeft && yBottom;
  var bottomCenter = xCenter && yBottom;
  var bottomRight = xRight && yBottom;

  if (topLeft) {
    mouseLocation = 'topLeft';
  } else if (topCenter) {
    mouseLocation = 'topCenter';
  } else if (topRight) {
    mouseLocation = 'topRight';
  } else if (centerLeft) {
    mouseLocation = 'centerLeft';
  } else if (centerCenter) {
    mouseLocation = 'centerCenter';
  } else if (centerRight) {
    mouseLocation = 'centerRight';
  } else if (bottomLeft) {
    mouseLocation = 'bottomLeft';
  } else if (bottomCenter) {
    mouseLocation = 'bottomCenter';
  } else if (bottomRight) {
    mouseLocation = 'bottomRight';
  }
}

function onMouseRight(e) {

}

function onMouseDoubleClick(e) {
  // todo, figure out where double click is on canvas
  // console.log(e);
  // if (e.button === 0) events.emit('network/send', 'player/interact', e);
}

function onMouseClick(e) {
  // if (e.button === 0) events.emit('network/send', 'player/inspect', e);
  // else if (e.button === 2) {
  //   switch (mouseLocation) {
  //     case 'topLeft':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'west'
  //       });
  //       break;
  //     case 'topCenter':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'northWest'
  //       });
  //       break;
  //     case 'topRight':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'north'
  //       });
  //       break;
  //     case 'centerLeft':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'southWest'
  //       });
  //       break;
  //     case 'centerCenter':
  //       break;
  //     case 'centerRight':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'northEast'
  //       });
  //       break;
  //     case 'bottomLeft':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'south'
  //       });
  //       break;
  //     case 'bottomCenter':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'southEast'
  //       });
  //       break;
  //     case 'bottomRight':
  //       events.emit('network/send', 'player/move', {
  //         dir: 'east'
  //       });
  //       break;
  //   }
  // }
}

function onKeyDown(e) {
  // terminal.focus();
  // switch (e.key) {
  //   case 'ArrowUp':
  //     terminal.prevHistory();
  //     break;
  //   case 'ArrowDown':
  //     terminal.nextHistory();
  //     break;
  //   case 'Enter':
  //     terminal.submit();
  //     break;
  // }
}

function onKeyUp(w) { }

function onKeyPress(e) { }
