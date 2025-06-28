import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;

      // 🧮 Total quantity of all items
      state.totalItems = action.payload.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // 💰 Total price of all items (with safety check for missing price)
      state.totalAmount = action.payload.reduce((acc, item) => {
        const price = item.productId?.price || 0;
        return acc + price * item.quantity;
      }, 0);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
