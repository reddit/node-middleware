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

      storeQueue = storeQueue.filter(([stateFn, cb]) => {
        if (stateFn(state)) {
          cb(state);
          return false;
        }

        return true;
      });

      actionQueue = actionQueue.filter(([actionFn, cb]) => {
        if (actionFn(action)) {
          cb(state);
          return false;
        }

        return true;
      });

      return next(action);
    };
  },
};
