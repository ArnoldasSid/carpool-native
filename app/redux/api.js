import SockJS from 'sockjs-client';
import DDP from 'ddp.js';
import { fromPromise, fromEvent, merge, empty } from 'most';

const ddp = new DDP({
  // endpoint: 'http://localhost:3000/sockjs',
  endpoint: 'http://stg.arciau.lt/sockjs',
  SocketConstructor: SockJS,
  autoConnect: true,
  autoReconnect: true,
  reconnectInterval: 5000,
});

let subs = [];

const call = (cmd, ...params) =>
  fromPromise(new Promise((resolve, reject) => {
    // console.log('Calling', cmd, params);
    const methodId = ddp.method(cmd, params);
    ddp.on('result', (message) => {
      if (message.id === methodId) {
        if (message.error) {
          // console.log('ERROR', message.error);
          reject(message.error)
        } else {
          // console.log('Success', message);
          resolve(message.result);
        }
      }
    })
  }));

// ddp.on('nosub', args => {
//   console.log('Nosub', args);
// });
// ddp.on('removed', args => {
//   console.log('removed', args);
// });

const add$ = fromEvent('added', ddp);
const ready$ = fromEvent('ready', ddp);
const nosub$ = fromEvent('nosub', ddp);
const changed$ = fromEvent('changed', ddp);
const removed$ = fromEvent('removed', ddp);

const subscribe = (subName, ...params) => {
  const subId = ddp.sub(subName, params);
  subs.push(subId);

  const collectionName = subName === 'notifications' ? 'Notifications' : subName;

  const subAdd$ = add$.filter(msg => msg.collection === collectionName);
  const subChange$ = changed$.filter(msg => msg.collection === collectionName);
  const subReady$ = ready$.filter(msg => msg.subs.indexOf(subId) !== -1);
  const stream = merge(subAdd$, subChange$, subReady$);

  if (subName === 'locations') {
    return {
      stream,
      subId
    }
  }

  return stream;
};

export const login = (email, password) => {
  return call('login', { user: { email }, password });
};

export const register = (email, password) => {
  return call('createUser', { email, password });
};

export const logout = () => {
  return call('logout');
};

export const registerDevice = (deviceId) => {
  if (deviceId == null) {
    alert('Incorrect device id');
    return empty();
  }
  return call('api.v1.registerDevice', deviceId);
};

export const requestRide = (userEmail, userId) => {
  // return fromPromise(Promise.resolve(3));
  return call('api.v1.requestRide', { userEmail, userId }, "MLjB32uWCXyZjRN5X");
};

export const acceptRequest = (payload, requesterId) => {
  return call('api.v1.acceptRideRequest', payload, requesterId);
};

export const markNotificationAsRead = (notificationId) => {
  return call('api.v1.ackNotification', notificationId);
};

export const saveLocation = (location) => {
  const timestamp = new Date().valueOf();

  return call('api.v1.saveLocation', {
    ...location,
    timestamp,
  });
};

export const subscribeToUsersLocation = (userId, numLocations = 1) => {
  const { stream, subId } = subscribe('locations', userId, numLocations);
  return {
    subId,
    location$: stream.filter(msg => msg.msg === 'ready' || msg.fields.userId === userId),
  }
};

export const subscribeToNotifications = () => {
  return subscribe('notifications');
};

export const unsub = (subId) => {
  ddp.unsub(subId);
};

export const unsubAll = () => {
  for (let sub of subs) {
    console.log('Unsubing sub', sub);
    ddp.unsub(sub);
  }
  subs = [];
};


ddp.on('connected', () => {
  console.log('Connected');
  // Start listening to calls and subscriptions
});
