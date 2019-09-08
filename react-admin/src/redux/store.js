import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'


import reducer from './reducers'
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));//内部会第一次调用reduer函数，得到初始state

export default store
