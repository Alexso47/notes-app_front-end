import React from 'react'
import '../css/Note.css'

const Note = ({ note, toggleImportance }) => {
	const classIcon = note.important
		? 'fas fa-star' : 'far fa-star'

	const formatDate = (date) => {
		let dateFormatted = new Date(date)
		return dateFormatted.toLocaleDateString()
	}

	return (
		<li className='note'>
			<div className='note-info'>
				<span id='note-author'>{note.user.name}</span>
				<span className='toggleImportance'><i title='Important' className={classIcon} onClick={toggleImportance}></i></span>
				<span id='note-date'>{formatDate(note.date)}</span>
			</div>
			<div className='note-content'>
				{note.content}
			</div>
			
		</li>
		)
}

export default Note