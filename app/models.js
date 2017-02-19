// @flow
export type Location = {
  latitude: number,
  longitude: number,
};

export type UsersRole = 'NONE' | 'RIDER' | 'DRIVER' | 'REQUESTER';

export type User = {
  id: string,
  email: string,
  role: UsersRole,
  location: Location,
};

export type Action = {
  type: string,
  payload: any,
};
