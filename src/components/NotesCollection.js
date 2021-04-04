import React from 'react';
import Note from './Note'

const NotesCollection = ({showAll, notesToShow, toggleImportanceOf, changeShowAll}) => {
    return (
        <div className='logged-content'> 
            <div className='important-button'>
                <button onClick={changeShowAll}>
                    show {showAll ? 'important' : 'all' }
                </button>
            </div>
            <ul className='notesList'>
                {notesToShow.map((note, i) => 
                <Note
                    key={i}
                    note={note} 
                    toggleImportance={() => toggleImportanceOf(note.id)}
                />
                )}
            </ul>
        </div>
    )
}

export default NotesCollection