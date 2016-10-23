const initialState = {
  notifications: [{
    from: {
      name: 'John',
      avatarUri: 'https://s-media-cache-ak0.pinimg.com/originals/89/dd/91/89dd915d0325cc0c20ae6987c4d8da6b.jpg',
    },
    type: 'CHAT_NOTIFICATION',
    message: 'Hello, I would like to further discuss our trip. I strongly believe that a trip without candy isn\'t a' +
    'good trip, therefore I suggest that I should brind some candy to make the trip just that little bit more awesome',
  }, {
    from: {
      name: 'Ana',
      avatarUri: 'https://41.media.tumblr.com/217d7ede1e66a3a5c7fabe5d4beef01c/tumblr_npavfqG2Fk1u3ca5ko8_400.png',
    },
    type: 'TRIP_REQUEST',
    trip: {
      from: {
        location: 'Akropolis',
        time: '18:00',
      },
      to: {
        location: 'Olandu g. 15',
        time: '18:20',
        approximateTime: true,
      },
      date: 'Jul 15 2016',
    },
  }]
};

export default function notificationsReducer (state = initialState, action) {
  return state;
}
