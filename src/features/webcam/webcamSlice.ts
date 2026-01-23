import { createSlice } from "@reduxjs/toolkit";

interface WebcamState {
    isOn: boolean;
}

const initialState: WebcamState = {
    isOn: false,
};

const webcamSlice = createSlice({
    name: "webcam",
    initialState,
    reducers: {
        webcamOn: (state) => {
            state.isOn = true;
        },
        webcamOff: (state) => {
            state.isOn = false;
        },
    },
});

export const { webcamOn, webcamOff } = webcamSlice.actions;
export default webcamSlice.reducer;
