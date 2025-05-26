import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/v1/',
        credentials: 'include'
    }),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        addOrderItems: builder.mutation({
            query: (orderId) => ({
                url: `add-order-items/${orderId}`,
                method: 'POST'
            }),
            async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // You can dispatch other actions here
                    console.log('Order items added successfully:', data);
                } catch (error) {
                    console.error('Failed to add order items:', error);
                }
            },
            invalidatesTags: ['Order']
        }),
        getOrderItems: builder.query({
            query: (orderId) => `get-order-items/${orderId}`,
            providesTags: ['Order']
        }),
        getOrderDetails: builder.query({
            query: () => 'orders',
            providesTags: ['Order']
        }),
        getAllOrderItems: builder.query({
            query: () => 'get-all-order-items',
            providesTags: ['Order']
        })
    })
})

export const { useAddOrderItemsMutation, useGetOrderItemsQuery, useGetOrderDetailsQuery,
    useGetAllOrderItemsQuery
 } = orderApi;
