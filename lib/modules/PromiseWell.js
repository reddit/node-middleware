export default {
  create() {
    const queue = [];

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
        return Promise.all(queue);
      }
    }
  }
}
