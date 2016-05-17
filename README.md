# r/middleware
Helpful Redux middleware

## Installation
Install via npm.

`npm install -S @r/middleware`

## Modules
@r/middleware exports two middlewares: `Thunker` and `PromiseWell`;

### Thunker
Thunker expands on a traditional Redux thunk utility. Namely, it requires that the thunking action returns a promise. As a result, it becomes easier to know when the thunked actions have completed: when the promise resolves, all thunked actions have fired.

```es6
// Initializing a Thunker
import Thunker from '@r/middleware/Thunker';

const thunk = Thunker.create();

// in Redux
applyMiddleware(..., thunk, ...);
```

To simplify using Thunker, it is highly recommended es7 style async functions are used.

```es6
// example thunked action

const getData = () => async (dispatch, getState, utils) => {
  // immediately dispatch synchronous actions as normal
  dispatch(/* sync action */);

  // wait for data if need be
  const { foo, bar } = await asyncFunctionCall();

  // continue to dispatch as normal
  dispatch(/* another action */);
};
```

Thunker performs an additional task. Many times, it becomes necessary to wait for some piece of state to update, or to wait for a particular action to be dispatched before another action is dispatched. Thunker solves this by surfacing two utility methods: `waitForState` and `waitForAction`. Both return a promise that can be `await`-ed on.

#### waitForState

```
waitForState(stateFn: Function, cb: Function [, stateFailedFn: Function]): Promise
```

`stateFn(state: Object): Boolean`

A function that creates the condition that must be met for the callback to fire. Receives a copy of state as its argument. Expected to return a truthy/falsey value.

`cb(state: Object): void`

A function that is called when the conditional is met. Receives a copy of state as its argument.

`stateFailedFn(state: Object): void` (OPTIONAL)

A function that is called the *first* time the conditional is *not* met. Only fires once. Receives a copy of state as its argument.


#### waitForAction

```
waitForAction(actionFn: Function, cb: Function): Promise
```

`actionFn: Function(action: Object)`

A function that receives a Redux action, represents the condition that must be met for the callback to fire. *After* `waitForAction` is invoked, if `action` is dispatched, the callback will fire.

`cb(state: Object): void`

A function that is called when the `action` is dispatched. Receives a copy of state as its argument.

### PromiseWell
The PromiseWell merely collects promises that dispatched by other middleware. It should be one of the last middleware invoked.

```es6
// Initializing a PromiseWell
import PromiseWell from '@r/middleware/PromiseWell';

const well = PromiseWell.create();

// in Redux
applyMiddleware(..., well.middleware, ...);

// on the server side
await well.onComplete();
```

In addition to capturing promises, the PromiseWell lets you query to check if all the captured promises have been completed through the use of `onComplete`.
