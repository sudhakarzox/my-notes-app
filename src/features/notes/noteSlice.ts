import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { Note } from "./types";

interface NotesState {
  notes: Note[];
  loading: boolean;
}

const initialState: NotesState = { notes: [], loading: false };

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const res = await api.get("/notes");
  return res.data;
});

export const createNote = createAsyncThunk("notes/createNote", async (note: Partial<Note>) => {
  const res = await api.post("/notes", note);
  return res.data;
});

export const updateNote = createAsyncThunk("notes/updateNote", async ({ note_id, note }: { note_id: string; note: Partial<Note> }) => {
  const res = await api.put(`/notes/${note_id}`, note);
  return res.data;
});

export const deleteNote = createAsyncThunk("notes/deleteNote", async (note_id: string) => {
  await api.delete(`/notes/${note_id}`);
  return note_id;
});

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => { state.notes = action.payload; })
      .addCase(createNote.fulfilled, (state, action) => { state.notes.push(action.payload); })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.notes = state.notes.map(n => (n.note_id === action.payload.note_id ? action.payload : n));
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.note_id !== action.payload);
      });
  },
});

export default noteSlice.reducer;
