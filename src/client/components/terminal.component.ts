module.exports = Terminal;
function Terminal (id, events) {
  this.element = document.querySelector(id);
  this.historyIndex = -1;
  this.history = [];

  // hook into input events
  this.events = events;
}
Terminal.prototype.focus = function () {
  this.element.focus();
}
Terminal.prototype.prevHistory = function () {
  if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
    this.historyIndex++;
    this.element.value = this.history[this.historyIndex];
  }
}
Terminal.prototype.nextHistory = function () {
  if (this.history.length > 0 && this.historyIndex > -1) {
    this.historyIndex--;
    if (this.historyIndex === -1) {
      this.element.value = '';
    } else {
      this.element.value = this.history[this.historyIndex];
    }

    // set caret at the end of line
    // strange hack for chrome
    setTimeout(() => { this.element.value = this.element.value; }, 0);
  }
}
Terminal.prototype.submit = function () {
  input = this.element.value;
  
  // check if input is not empty
  if (input !== '') {
    // update terminal history if it's not the same
    // as last input
    if (this.history[0] !== input) {
      this.history.unshift(input);
    }
    // console.log(terminalHistory, historyIndex);
    this.historyIndex = -1;

    this.events.emit('network/send', 'player/message', input);

    this.element.value = '';
  }
}
