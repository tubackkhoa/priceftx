class FuturePrice {
  constructor({tickTime = 5 * 60 * 1000, interval = 5000} = {}) {
    this.prevTick = Date.now() - tickTime - 1;
    this.tickTime = tickTime;
    this.interval = interval;
    this.data = {};
    this.timer = null;
  }

  async stop() {
    clearInterval(this.timer);
  }

  sync(newData, reset) {
    if (reset) {
      for (let item of newData) {
        item.prevMarginPrice = item.marginPrice;
        item.change = 0;
        this.data[item.name] = item;
        this.data[item.name].up = [];
      }
    } else {
      // update price
      for (let item of newData) {
        this.data[item.name].marginPrice = item.marginPrice;
        this.data[item.name].change =
          item.marginPrice - this.data[item.name].prevMarginPrice;
        this.data[item.name].up.push(this.upIcon(this.data[item.name].change));
        if (this.data[item.name].up.length >= 11) {
          this.data[item.name].up.shift();
        }
      }
    }
  }

  upIcon (value) {
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
}

export default FuturePrice;
