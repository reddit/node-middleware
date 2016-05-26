export default {
  create() {
    let queue = [];

    const processQueue = (index, cb) => {
      const p = queue[index];

      if (p) {
        p.then(() => processQueue(index + 1, cb));
      } else {
        cb();
      }
    };

    return {
      middleware(store) {
        return next => action => {
          if (action instanceof Promise) {
            queue.push(action);
            return;
          }

          return next(action);
        };
      },
      onComplete() {
        return new Promise((resolve, reject) => {
          processQueue(0, resolve);
        }).then(() => {
          queue = [];
        });
      }
    }
  }
}
