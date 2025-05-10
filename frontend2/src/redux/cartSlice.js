import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from "react-hot-toast"

// getCartItems
export const fetchAllCartItems = createAsyncThunk(
    'cart/fetchAllCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/getCart`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to fetch cart items');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to connect to server');
        }
    }
)

// add to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/addToCart/${productId}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to add to cart');
            }
            toast.success("Item added to cart")
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to connect to server');
        }
    }
)

// delete from cart
export const deleteFromCart = createAsyncThunk(
    'cart/deleteFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/deleteCartItem/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to delete from cart');
            }
            toast.success("Item removed from cart")
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to connect to server');
        }
    }
)

// remove one product
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/updateCartItem/${productId}`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to remove from cart');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to connect to server');
        }
    }
)


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCartItems.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllCartItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.items = action.payload;
            })
            .addCase(fetchAllCartItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addToCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.items = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteFromCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteFromCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.items = action.payload;
            })
            .addCase(deleteFromCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.items = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})



// export const {  } = productSlice.actions;

export default cartSlice.reducer;