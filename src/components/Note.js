import React from 'react'

const Note = ({ note, toggleImportance }) => {
	const label = note.important
		? 'make not important' : 'make important'

	const formatDate = (date) => {
		let dateFormatted = new Date(date)
		return dateFormatted.toLocaleDateString()
	}

	return (
		<li className='note'>
			<div className='note-info'>
				<span id='note-author'>{note.user.name}</span>
				<span id='note-date'>{formatDate(note.date)}</span>
			</div>
			<div className='note-content'>
				{note.content}
			</div>
			<button className='toggleImportance' onClick={toggleImportance}>{label}</button>
		</li>
		)
}

export default Note