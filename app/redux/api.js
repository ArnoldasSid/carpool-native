import SockJS from 'sockjs-client';
import DDP from 'ddp.js';
import { fromPromise, fromEvent, merge } from 'most';

const ddp = new DDP({
  // endpoint: 'http://localhost:3000/sockjs',
  endpoint: 'http://stg.arciau.lt/sockjs',
  SocketConstructor: SockJS,
});

const call = (cmd, ...params) =>
  fromPromise(new Promise((resolve, reject) => {
    const methodId = ddp.method(cmd, params);
    ddp.on('result', (message) => {
      if (message.id === methodId) {
        if (message.error) {
          console.log('ERROR', message.error);
          reject(message.error)
        } else {
          console.log('Success', message.result);
          resolve(message.result);
        }
      }
    })
  }));

const subscribe = (subName, ...params) => {
  const subId = ddp.sub(subName, params);
  console.log(subId);

  // TODO don't create new subs every time
  ddp.on('added', (...args) => {
    console.log('Sub added', args);
  });
  ddp.on('ready', (...args) => {
    console.log('Sub ready', args);
  });
  ddp.on('nosub', (...args) => {
    console.log('Nosub', args);
  });
  ddp.on('changed', (...args) => {
    console.log('changed', args);
  });
  ddp.on('removed', (...args) => {
    console.log('removed', args);
  });

  const add$ = fromEvent('added', ddp);
  const ready$ = fromEvent('ready', ddp);
  const nosub$ = fromEvent('nosub', ddp);
  const changed$ = fromEvent('changed', ddp);
  const removed$ = fromEvent('removed', ddp);

  return merge(add$, ready$, nosub$, changed$, removed$);
};

export const login = (email, password) => {
  return call('login', { user: { email }, password });
};

export const register = (email, password) => {
  return call('createUser', { email, password });
};

export const saveLocation = (location) => {
  console.log('Saving location', location);
  return call('api.saveLocation', location);
};

export const subscribeToUsersLocation = (userId, numLocations) => {
  subscribe('locations', userId, numLocations);
};

ddp.on('connected', () => {
  console.log('Connected');
  // Start listening to calls and subscriptions
});