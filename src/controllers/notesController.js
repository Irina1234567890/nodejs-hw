// import createHttpError from 'http-errors';
// import { Note } from '../models/note.js';

// // Отримати всі нотатки
// export const getAllNotes = async (req, res, next) => {
//   try {
//     const notes = await Note.find();
//     res.status(200).json(notes);
//   } catch (error) {
//     next(error);
//   }
// };

// // Отримати нотатку за id
// export const getNoteById = async (req, res, next) => {
//   try {
//     const { noteId } = req.params;
//     const note = await Note.findById(noteId);

//     if (!note) {
//       next(createHttpError(404, 'Note not found'));
//       return;
//     }

//     res.status(200).json(note);
//   } catch (error) {
//     next(error);
//   }
// };

// // Створити нову нотатку
// export const createNote = async (req, res, next) => {
//   try {
//     const note = await Note.create(req.body);
//     res.status(201).json(note);
//   } catch (error) {
//     next(error);
//   }
// };

// // Видалити нотатку
// export const deleteNote = async (req, res, next) => {
//   try {
//     const { noteId } = req.params;
//     const note = await Note.findOneAndDelete({ _id: noteId });

//     if (!note) {
//       next(createHttpError(404, 'Note not found'));
//       return;
//     }

//     res.status(200).json(note);
//   } catch (error) {
//     next(error);
//   }
// };

// // Оновити нотатку
// export const updateNote = async (req, res, next) => {
//   try {
//     const { noteId } = req.params;

//     const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
//       new: true,
//     });

//     if (!note) {
//       next(createHttpError(404, 'Note not found'));
//       return;
//     }

//     res.status(200).json(note);
//   } catch (error) {
//     next(error);
//   }
// };

import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      search,
      tag,
      sortBy = "_id",
      sortOrder = "asc"
    } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);
    const query = {};

    // Пошук через текстовий індекс (згідно з ТЗ)
    if (search) {
      query.$text = { $search: search };
    }

    // Фільтрація за тегом
    if (tag) {
      query.tag = tag;
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(query),
      Note.find(query)
        .skip(skip)
        .limit(Number(perPage))
        .sort({ [sortBy]: sortOrder }),
    ]);

    const totalPages = Math.ceil(totalNotes / Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return next(createHttpError(404, `Note with id ${noteId} not found`));
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create(req.body);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  try {
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return next(createHttpError(404, `Note with id ${noteId} not found`));
    }
    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return next(createHttpError(404, `Note with id ${noteId} not found`));
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
