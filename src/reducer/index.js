import shopCartReducer from './shopCartReducer'
import { combineReducers } from 'redux'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

//Định nghĩa cấu hình cụ thể cho reducer shopcart
const shopcartPersistConfig = {
    ...persistCommonConfig,
    key: 'shopcart',
    whitelist: ['listCartItem']
};

//Kết hợp các reducers thành một reducer duy nhất
const rootReducer = combineReducers({
    shopcart: persistReducer(shopcartPersistConfig, shopCartReducer),

});

export default rootReducer