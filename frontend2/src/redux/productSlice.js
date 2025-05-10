import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

//getAllProducts for admin
export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
)

// getProducts for customer
export const getProductsForCustomer = createAsyncThunk(
  'products/getProductsForCustomer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/customerProducts`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
)

// get Products for customer
export const getShuffleProducts = createAsyncThunk(
  'products/getShuffleProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products/shuffle`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
)


// fetchSingleProduct
export const fetchSingleProduct = createAsyncThunk(
  'products/fetchSingleProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products/${productId}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
)



// createProduct
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to create product');
      }

      toast.success("Product created successfully")
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
);



// Update the updateProduct thunk to accept id properly
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {  // Destructure id and data
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update product');
      }
      toast.success("Product updated successfully")
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to delete product');
      }

      toast.success("Product deleted successfully")
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to connect to server');
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    searchData: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    productsEmpty: (state) => {
      state.products = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getProductsForCustomer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProductsForCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.products = action.payload;
      })
      .addCase(getProductsForCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getShuffleProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getShuffleProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.products = action.payload;
      })
      .addCase(getShuffleProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;   
      })
      .addCase(fetchSingleProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.singleProduct = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.products)) {
          state.products = state.products.filter((product) => product.id !== action.meta.arg);
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updatedProduct = action.payload;
        const index = state.products.findIndex((product) => product.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addSearchData,productsEmpty } = productSlice.actions;

export default productSlice.reducer;