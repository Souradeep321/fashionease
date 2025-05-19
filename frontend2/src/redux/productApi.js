import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
        reducerPath: "productApi",
        baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/" }),
        tagTypes: ["Product"],
        endpoints: (builder) => ({
            getProducts: builder.query({
                query: () => "customerProducts",
                providesTags: ["Product"],
            }),
            addProduct: builder.mutation({
                query: (data) => ({
                    url: "products",
                    method: "POST",
                    body: data,
                }),
                invalidatesTags: ["Product"],
            }),
        }),
    });

export const { useGetProductsQuery, useAddProductMutation } = productApi