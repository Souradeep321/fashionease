import { configureStore } from '@reduxjs/toolkit'
import productReducer from './productSlice.js'
import { authApi } from './authApi.js'
import { cartApi } from './cartApi.js'
import { productApi } from './productApi.js'
import { orderApi } from './orderApi.js'

export const store = configureStore({
    reducer: {
        products: productReducer,
        [authApi.reducerPath]: authApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(cartApi.middleware)
            .concat(productApi.middleware)
            .concat(orderApi.middleware)
})
