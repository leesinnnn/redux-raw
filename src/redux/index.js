import { createStore, applyMiddleware, compose } from 'redux';

function myCreateStore(reducer, enhancer) {
  let state = reducer(undefined, {});
  const listeners = [];

  if (typeof enhancer === 'function') {
    const newCreateStore = enhancer(myCreateStore);
    return newCreateStore(reducer)
  }

  function dispatch(action) {
    state = reducer(state, action)

    listeners.forEach(fn => fn());
  }

  function getState() {
    return state
  }

  function subscribe(fn) {
    listeners.push(fn)
  }

  return {
    getState,
    dispatch,
    subscribe
  }
}

function myApplyMiddleWare(...middleWares) {
  return function(createStore) {
    return function(reducer) {
      const store = createStore(reducer)
      const { dispatch } = store;
      const composedDispatch = compose(...middleWares.map(fn => fn(store)))(dispatch)
      return {
        ...store,
        dispatch: composedDispatch
      }
    }
  }
}



const initState = {
  a: 1
}

const reducer1 = (state = initState, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        a: state.a + 1
      };
    case 'minus':
      return {
        ...state,
        a: state.a - 1
      };
    default:
      return state;
  }
}

const middleWare =
  (store) =>
    (next) =>
      (action) => {
        console.log(action, 'action');
        next(action);
        console.log(store.getState(), 'store.getState()')
      }

export const store = myCreateStore(reducer1, myApplyMiddleWare(middleWare))