export default {
  create() {
    let queue = [];

    const processQueue = (index, cb) => {
      const p = queue[index];

      if (p) {
        const processNext = () => processQueue(index + 1, cb);
        // process the next item if we fail or not, so that onComplete
        // is guranteed to finish with as much data loaded as possible
        p
          .then(processNext)
          .catch(processNext);
        // TODO: we need to revisit how this .catch fits in with node-platform's
        // Server.js. Developers already have to make use of `.catch` handlers
        // to deal with asyncronus errors in Promises, but platform/server
        // might want to expose an explicit `onRouteError` or `onAsyncActionError` callback
      } else {
        cb();
      }
    };

    return {
      middleware(store) {
        return next => action => {
          if (action instanceof Promise) {
            queue.push(action);
            return action;
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
