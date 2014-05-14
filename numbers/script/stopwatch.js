var Stopwatch = function(timer, options) {
  
  var offset,
      clock,
      interval;
  
  // default options
  options = options || {};
  options.delay = options.delay || 1;
 
  // initialize
  reset();
  
  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }
  
  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  
  function reset() {
    clock = 0;
    render();
  }
  
  function update() {
    clock += delta();
    if (clock >= 99999) {
      options.game.endGame('timeout');
      clock = 99999;
    }
    render();
  }
  
  function render() {
    var t = clock/1000;
    timer.innerHTML = t.toFixed(3); 
  }
  
  function delta() {
    var now = Date.now(),
        d   = now - offset;
    
    offset = now;
    return d;
  }
  
  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
};
