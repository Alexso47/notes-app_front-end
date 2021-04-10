import React, {useState} from 'react';
import '../css/NoteForm.css'

const NoteForm = ({username, handleLogout, addNote}) => {
    const [newNote, setNewNote] = useState('')

    const handleChange = (event) => {
        setNewNote(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
		const noteObject = {
			content: newNote,
			important: false
		}
        await addNote(noteObject)
        setNewNote('')
    }

    return (
        <div className='logged-content' id='top-content'>
            <span>
                Welcome { username } !
                &nbsp;
                <i id='logout-icon' title='Logout' className="fas fa-sign-out-alt" onClick={handleLogout}></i>
            </span>
            <form onSubmit={handleSubmit} className='newNoteForm'>
                <input value={newNote} onChange={handleChange} placeholder='type a NEW NOTE'/>
                <button title='Add note' type="submit"><i class="fas fa-plus"></i></button>
            </form>
        </div>
    )
}

export default NoteForm