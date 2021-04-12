/* eslint-disable indent */
import React, { useState } from 'react'
import '../css/Note.css'
import '../css/PopupConfirm.css'
import noteService from '../services/notes'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

const Note = ({ note, toggleImportance, filterByUser, userLogged, setErrorMessage, setModifiedNotes, deleteNote }) => {
	const [editContent, setEditContent] = useState('')
	const [editEnabled, setEditEnabled] = useState(false)

	const classIcon = note.important
		? 'fas fa-star' : 'far fa-star'

	const formatDate = (date) => {
		let dateFormatted = new Date(date)
		return dateFormatted.toLocaleDateString()
	}

	const handleEditChange = (event) => {
		setEditContent(event.target.value)
	}

	const enableEditContent = () => {
		let contentElement = document.getElementById('note-content-' + note.id)
		const height = contentElement.clientHeight
		const idDiv = contentElement.id
		setEditContent(contentElement.textContent)

		let textAreaElement = document.createElement('TEXTAREA')
		const text = document.createTextNode(contentElement.textContent)
		textAreaElement.appendChild(text)
		textAreaElement.className = 'editContent'
		textAreaElement.id = idDiv
		textAreaElement.style.minHeight = height+'px'
		contentElement.parentNode.replaceChild(textAreaElement, contentElement)
		textAreaElement.focus()
		textAreaElement.addEventListener('change', handleEditChange)
		setEditEnabled(true)
	}

	const unableEditContent = (noteContent) => {
		noteContent = noteContent || note.content
		let textAreaElement = document.getElementById('note-content-' + note.id)
		const height = textAreaElement.clientHeight
		const idTextArea = textAreaElement.id

		let contentElement = document.createElement('DIV')
		const text = document.createTextNode(noteContent)
		contentElement.appendChild(text)
		contentElement.className = 'note-content'
		contentElement.id = idTextArea
		contentElement.style.minHeight = height+'px'
		contentElement.style.height = height+'px'
		textAreaElement.parentNode.replaceChild(contentElement, textAreaElement)
		setEditEnabled(false)
	}

	const handleSave = async () => {
		if(note.content !== editContent && editContent !== '' ) {
			const changedNote = { ...note, content: editContent }
			try {
				const returnedNote = await noteService.update(note.id, changedNote)
				for(let k in returnedNote) note[k] = returnedNote[k]
				unableEditContent(returnedNote.content)
				setModifiedNotes(true)
			}
			catch(error) {
				setErrorMessage(`Note ${note.content} could not be updated`)
				setTimeout(() => {
					setErrorMessage(null)
				}, 10000)
			}
		}
		else {
			setErrorMessage('Note content cannot be updated')
				setTimeout(() => {
					setErrorMessage(null)
				}, 10000)
		}
	}

	const handleDelete = (id) => {
		document.getElementById('note-item-' + id).classList.toggle('deletedNote')
		setTimeout(async () => {
			deleteNote(id)
		}, 500)

	}

	const filterUserTitle = 'Created by ' + note.user.name

	const editNoteContent = userLogged === note.user.username
		? !editEnabled
			?
			<div>
				<div className='editButton' id='edit-button'>
					<i title='Edit content' className='fas fa-edit' onClick={enableEditContent}></i>
				</div>
				<span className='delete-button' id='delete-note'>
					<Popup
						trigger={<i title='delete note' className="fas fa-trash"></i>} modal>
							{close => (
							<div className='popup-confirm message'>
								<span>Are you sure that you want to delete note with id: <span className='id-delete'>{note.id}</span> ?</span>
								<button className='popup-confirm options' onClick={close}>
									No
								</button>
								<button className='popup-confirm options' onClick={() => {
									handleDelete(note.id)
									close()}}>
										Yes
								</button>
							</div>
							)}
					</Popup>
				</span>
			</div>
			: 	<div className='editButton' id='edit-button'>
					<button title='abort' className='edit-buttons' id='clear-edit' onClick={() => unableEditContent(note.content)}>cancel</button>
					<button title='save changes' className='edit-buttons' id='save-edit' onClick={handleSave}>save</button>
				</div>
		: ''

	return (
		<li className='note' id={'note-item-' + note.id}>
			<div className='note-info'>
				<span id='note-author' title={filterUserTitle} onClick={() => filterByUser(note.user.name)}>{note.user.name}</span>
				<span id='note-date'>{formatDate(note.date)}</span>
				<span className='toggleImportance'><i title='Important' className={classIcon} onClick={toggleImportance}></i></span>
			</div>
			<div className='note-content' id={'note-content-' + note.id}>
				{note.content}
			</div>
			{editNoteContent}
		</li>
	)
}

export default Note