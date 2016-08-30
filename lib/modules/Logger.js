export default store => next => action => {
  let result;
  console.group(action.type);
  if (console.group) {
    console.log('%c prev state', 'color: grey', store.getState());
    console.log('%c dispatching', 'color: blue', action);
    result = next(action);
    console.log('%c next state', 'color: green', store.getState());
    console.groupEnd(action.type);
  } else {
    console.log('prev state', store.getState());
    console.log('dispatching', action);
    result = next(action);
    console.log('next state', store.getState());
  }
  return result;
};
