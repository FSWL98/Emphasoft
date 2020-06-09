import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { array, object } from 'prop-types';

type SetActionType = {
    users: array
};

type AddActionType = {
    user: object
};

type UpdateActionType = {
    id: number,
    user: object
}

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: null
    },
    reducers: {
        setUsers (state, action: PayloadAction<SetActionType>) {
            state.users = action.payload.users;
        },
        addUser (state, action: PayloadAction<AddActionType>) {
            state.users.push(action.payload.user);
        },
        updateUser (state, action: PayloadAction<UpdateActionType>) {
            state.users = state.users.map((el) => {
                if (el.id === action.payload.id)
                    return action.payload.user;
                else return el;
            });
        }
    }
});

export const { setUsers, addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;