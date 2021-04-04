import React from 'react';

const NoteForm = ({user, handleLogout, addNote, newNote, handleNoteChange}) => {
    return (
        <div className='logged-content' id='top-content'>
            <span>
                Welcome { user.name } !
                &nbsp;
                <button onClick={handleLogout}>
                    Log-out
                </button>
            </span>
            <form onSubmit={addNote} className='newNoteForm'>
                <input value={newNote} onChange={handleNoteChange} placeholder='type a new note'/>
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default NoteForm