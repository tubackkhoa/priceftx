class FuturePrice {
  constructor({ tickTime = 5 * 60 * 1000, interval = 2000 } = {}) {
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

  start = async (onData) => {
    try {
      const { result } =
        process.env.NODE_ENV === 'development'
          ? require('./data.json')
          : await fetch('https://ftx.com/api/futures').then((res) =>
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
