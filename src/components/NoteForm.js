import React, {useState} from 'react';

const NoteForm = ({username, handleLogout, addNote}) => {
    const [newNote, setNewNote] = useState('')

    const handleChange = (event) => {
        setNewNote(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
		const noteObject = {
			content: newNote,
			important: Math.random() > 0.5
		}

        await addNote(noteObject)
        setNewNote('')
    }

    return (
        <div className='logged-content' id='top-content'>
            <span>
                Welcome { username } !
                &nbsp;
                <button onClick={handleLogout}>
                    Log-out
                </button>
            </span>
            <form onSubmit={handleSubmit} className='newNoteForm'>
                <input value={newNote} onChange={handleChange} placeholder='type a new note'/>
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default NoteForm