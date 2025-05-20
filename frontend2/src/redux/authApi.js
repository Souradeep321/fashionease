import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/v1/' , credentials: 'include' }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => ({
                url: 'profile',
                method: 'GET',
                credentials:'include'
            }),
            providesTags: ['Auth']
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: 'register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth']
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
                credentials:'include'
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    // Optional: Success feedback or log result
                    console.log("Login success", result);
                } catch (err) {
                    console.error("Login failed:", err);
                }
            }
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'POST',
                credentials:'include'

            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    // Optional: Success feedback or log result
                    console.log("Logout success", result);
                } catch (err) {
                    console.error("Logout failed:", err);
                }
            }
        })
    })
})

export const { useGetProfileQuery, useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi