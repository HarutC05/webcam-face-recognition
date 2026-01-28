import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FaceExpressions = {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
};

export type Gender = "male" | "female";

export interface Face {
    x: number;
    y: number;
    width: number;
    height: number;
    age?: number;
    gender?: Gender;
    expressions?: FaceExpressions;
}

interface FaceState {
    faces: Face[];
}

const initialState: FaceState = { faces: [] };

const faceSlice = createSlice({
    name: "face",
    initialState,
    reducers: {
        setFaces: (state, action: PayloadAction<Face[]>) => {
            state.faces = action.payload;
        },
        clearFaces: (state) => {
            state.faces = [];
        },
    },
});

export const { setFaces, clearFaces } = faceSlice.actions;
export default faceSlice.reducer;
