import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import productReducer from './productSlice.js'
import cartReducer from './cartSlice.js'
import { authApi } from './authApi.js'
import { cartApi } from './cartApi.js'
import { productApi } from './productApi.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [productApi.reducerPath]: productApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(cartApi.middleware)
            .concat(productApi.middleware)
})
