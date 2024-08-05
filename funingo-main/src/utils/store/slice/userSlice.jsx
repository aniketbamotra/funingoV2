import { createSlice } from '@reduxjs/toolkit';
import { getAllTickets, getFreebies } from '../../../actions/ticket';

const capitalizeFirstLetter = inputString => {
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  );
};
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    userData: null,
    isLoggedIn: false,
    packagesData: [],
    packageMap: null,
    freebiesArray: [],
    personsList: [],
    token: '',
    isPremium: false
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload;
      if (action.payload.premium?.length > 0) {
        for (let data of action.payload.premium) {
          if (new Date(data.expires_on) > Date.now()) {
            state.isPremium = true;
            return;
          }
        }
      }
    },

    addToken: (state, action) => {
      state.token = action.payload;
    },
    removeUser: state => {
      state.userData = null;
      state.isLoggedIn = false;
      state.packageMap = null;
      state.personsList = [];
      state.token = '';
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
      if (action.payload === false) state.userData = null;
    },
    setVerified: (state, action) => {
      state.userData.verified = action.payload;
    },

    addPackages: (state, action) => {
      state.packagesData = action.payload;
      const obj = {};
      action.payload.map((item, ind) => {
        obj[item?._id] = {
          price: item?.price ? item.price : '0',
          package_name: capitalizeFirstLetter(
            item?.name ? item.name : 'Not Available'
          )
        };
        return {};
      });
      state.packageMap = obj;
      state.freebiesArray = [];
    },
    addFreebies: (state, action) => {
      state.freebiesArray = action.payload;
    },
    removeFreebies: (state, action) => {
      state.freebiesArray = [];
    },

    addPersons: (state, action) => {
      state.personsList = action.payload;
    },

    removePersons: (state, action) => {
      state.personsList = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(getFreebies.fulfilled, (state, action) => {
      state.freebiesArray = action.payload.freebies;
    });
  }
});

export const {
  addUser,
  removeUser,
  setLoggedIn,
  addPackages,
  addFreebies,
  addToken,
  addPersons,
  removePersons,
  removeFreebies,
  setVerified
} = userSlice.actions;
export default userSlice.reducer;
