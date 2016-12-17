// @flow
import R from 'ramda'
import type { User } from '../../models.js'
export default (state: any): User[] => R.values(state.trip.otherUsers)
