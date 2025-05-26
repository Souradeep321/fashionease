import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api/v1/",
        credentials: "include",
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getAdminProducts: builder.query({
            query: () => "products",
            providesTags: ["Product"],

        }),
        getProducts: builder.query({
            query: () => "customerProducts",
            providesTags: ["Product"],
        }),
        getRandomProducts: builder.query({
            query: () => "customerProducts/shuffle",
            providesTags: ["Product"],
        }),
        addProduct: builder.mutation({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(productApi.util.updateQueryData('getProducts', undefined, (draft) => {
                        draft.push(data);
                    }));
                } catch (error) {
                    console.error('Failed to add product:', error);
                }
            },
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(productApi.util.updateQueryData('getProducts', undefined, (draft) => {
                        return draft.filter(product => product._id !== arg);
                    }));
                } catch (error) {
                    console.error('Failed to delete product:', error);
                }
            },
        }),
    }),
});

export const { useGetAdminProductsQuery, useGetProductsQuery, useAddProductMutation, useGetRandomProductsQuery, useDeleteProductMutation } = productApi