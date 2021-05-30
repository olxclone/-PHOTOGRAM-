import { combineReducers } from "redux"

import user from './users'

export const rootReducer = combineReducers({
    userState : user
})