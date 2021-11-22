class FuturePrice {
  constructor({tickTime = 5 * 60 * 1000, interval = 2000} = {}) {
    this.prevTick = Date.now() - tickTime - 1;
    this.tickTime = tickTime;
    this.interval = interval;
    this.data = {};
    this.timer = null;
    this.timer5s = null;
    this.timer1m = null;
    this.timer5m = null;
  }

  async stop() {
    clearInterval(this.timer);
    clearInterval(this.timer5s);
    clearInterval(this.timer1m);
    clearInterval(this.timer5m);
  }

  sync(newData, reset) {
    if (reset) {
      for (let item of newData) {
        item.prevMarginPrice = item.marginPrice;
        if (this.data && this.data[item.name] && typeof this.data[item.name].prevMarginPrice5s !== 'undefined') {
          item.prevMarginPrice5s = this.data[item.name].prevMarginPrice5s;
          item.prevMarginPrice1m = this.data[item.name].prevMarginPrice1m;
          item.prevMarginPrice5m = this.data[item.name].prevMarginPrice5m;
          item.up5s = this.data[item.name].up5s;
          item.up1m = this.data[item.name].up1m;
          item.up5m = this.data[item.name].up5m;
        } else {
          item.prevMarginPrice5s = item.marginPrice;
          item.prevMarginPrice1m = item.marginPrice;
          item.prevMarginPrice5m = item.marginPrice;
          item.up5s = [];
          item.up1m = [];
          item.up5m = [];
        }
        item.change = 0;
        this.data[item.name] = item;
      }
    } else {
      // update price
      for (let item of newData) {
        this.data[item.name].marginPrice = item.marginPrice;
        this.data[item.name].change =
          item.marginPrice - this.data[item.name].prevMarginPrice;
      }
    }
  }

  upIcon(value) {
    if (value > 0) {
      return '↑';
    } else if (value === 0) {
      return '↔';
    } else {
      return '↓';
    }
  }

  start = async (onData) => {
    try {
      const {result} = await fetch('https://ftx.phutx.top').then((res) =>
        res.json()
      );
      const newTick = Date.now();
      const reset = newTick - this.prevTick > this.tickTime;
      this.sync(result, reset);
      if (reset) {
        this.prevTick = newTick;
      }
      if (onData) onData(Object.values(this.data));
    } catch (ex) {
      console.log(ex.message);
    }
    this.timer = setTimeout(this.start, this.interval, onData);
  };

  start5s = async (onData) => {
    if (this.data) {
      for (var key of Object.keys(this.data)) {
        if (!this.data[key].up5s) {
          this.data[key].up5s = [];
        }
        this.data[key].up5s.push(this.upIcon(this.data[key].marginPrice - this.data[key].prevMarginPrice5s));
        if (this.data[key].up5s.length >= 11) {
          this.data[key].up5s.shift();
        }
        this.data[key].prevMarginPrice5s = this.data[key].marginPrice;
      }
    }
    this.timer5s = setTimeout(this.start5s, 5000, onData);
  }

  start1m = async (onData) => {
    if (this.data) {
      for (var key of Object.keys(this.data)) {
        if (!this.data[key].up1m) {
          this.data[key].up1m = [];
        }
        this.data[key].up1m.push(this.upIcon(this.data[key].marginPrice - this.data[key].prevMarginPrice1m));
        if (this.data[key].up1m.length >= 11) {
          this.data[key].up1m.shift();
        }
        this.data[key].prevMarginPrice1m = this.data[key].marginPrice;
      }
    }
    this.timer1m = setTimeout(this.start1m, 60000, onData);
  }

  start5m = async (onData) => {
    if (this.data) {
      for (var key of Object.keys(this.data)) {
        if (!this.data[key].up5m) {
          this.data[key].up5m = [];
        }
        this.data[key].up5m.push(this.upIcon(this.data[key].marginPrice - this.data[key].prevMarginPrice5m));
        if (this.data[key].up5m.length >= 11) {
          this.data[key].up5m.shift();
        }
        this.data[key].prevMarginPrice5m = this.data[key].marginPrice;
      }
    }
    this.timer5m = setTimeout(this.start5m, 5 * 60000 - 2, onData);
  }
}

export default FuturePrice;
