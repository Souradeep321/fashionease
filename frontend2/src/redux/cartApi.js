// src/redux/cartApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1/',
    credentials: 'include',
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // 1️⃣ Fetch all cart items
    fetchCartItems: builder.query({
      query: () => 'getCart',
      providesTags: ['Cart'],
    }),

    // 2️⃣ Add one unit of a product to cart
    addToCart: builder.mutation({
      query: (productId) => ({
        url: `addToCart/${productId}`,
        method: 'POST',
      }),
      // invalidate so we refetch if the optimistic update fails
      invalidatesTags: ['Cart'],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        // Optimistically update cache
        const patch = dispatch(
          cartApi.util.updateQueryData('fetchCartItems', undefined, (draft) => {
            // increment total item count
            draft.cartItems += 1;
            // try to find existing
            const existing = draft.cart.find((it) => it.product.id === productId);
            if (existing) {
              existing.quantity += 1;
            } else {
              // placeholder object; real data comes on refetch
              draft.cart.push({
                id: Date.now(), // temp key
                product: { id: productId },
                quantity: 1,
              });
            }
            // adjust total price (we don't know price here—will correct on refetch)
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // 3️⃣ Remove one unit from an item (qty–1)
    updateCartItem: builder.mutation({
      query: (itemId) => ({
        url: `updateCartItem/${itemId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Cart'],
      async onQueryStarted(itemId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData('fetchCartItems', undefined, (draft) => {
            const item = draft.cart.find((it) => it.id === itemId);
            if (!item) return;
            item.quantity -= 1;
            if (item.quantity <= 0) {
              draft.cart = draft.cart.filter((it) => it.id !== itemId);
              draft.cartItems -= 1;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // 4️⃣ Delete an item entirely
    deleteFromCart: builder.mutation({
      query: (itemId) => ({
        url: `deleteCartItem/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
      async onQueryStarted(itemId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData('fetchCartItems', undefined, (draft) => {
            const item = draft.cart.find((it) => it.id === itemId);
            if (!item) return;
            // reduce count by this item's quantity
            draft.cartItems -= item.quantity;
            draft.cart = draft.cart.filter((it) => it.id !== itemId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useFetchCartItemsQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useDeleteFromCartMutation,
} = cartApi;
