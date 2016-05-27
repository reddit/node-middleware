export default {
  create() {
    let storeQueue = [];
    let actionQueue = [];

    const waitForAction = (actionFn, cb=()=>{}) => new Promise((resolve, reject) => {
      actionQueue = actionQueue.concat([[actionFn, state => resolve(state)]]);
    }).then(cb);

    return store => next => action => {
      const { dispatch, getState } = store;

      const state = getState();

      const waitForState = (stateFn, cb=()=>{}, stateFailedFn=()=>{}) => new Promise((resolve, reject) => {
        if (!stateFn(state)) {
          storeQueue = storeQueue.concat([[stateFn, newState => resolve(newState)]]);
          stateFailedFn(state);
        } else {
          resolve(state);
        }
      }).then(cb);

      if (typeof action === 'function') {
        const result = action(dispatch, getState, { waitForState, waitForAction });

        if (!(result instanceof Promise)) {
          throw new Error('Thunked actions must return promises');
        }

        return next(result);
      }

      actionQueue = actionQueue.filter(([actionFn, cb]) => {
        if (actionFn(action)) {
          cb(state);
          return false;
        }

        return true;
      });

      // order of operations is very important here.
      // for the store queue to process properly, we need to let the new action
      // make its way into the store first before we check if any queued
      // waitForState situations are resolveable
      next(action);

      // also important, the store queue filter function must re-fetch state
      // using getState, otherwise the aforementioned action's effects will not
      // be reflected in the filter function.
      storeQueue = storeQueue.filter(([stateFn, cb]) => {
        const state = getState();
        if (stateFn(state)) {
          cb(state);
          return false;
        }

        return true;
      });
    };
  },
};
