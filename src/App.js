import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import NotesCollection from './components/NotesCollection'

const App = () => {
	const [notes, setNotes] = useState([])
	const [errorMessage, setErrorMessage] = useState(null)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	const [modifiedNotes, setModifiedNotes] = useState(false)

	useEffect(() => {
		if(user !== null) {
			noteService.getAll()
				.then(updatedNotes => {
					setNotes(updatedNotes)
				})
			setModifiedNotes(false)
		}
	}, [user, modifiedNotes])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
		if(loggedUserJSON) {
			const userLogged = JSON.parse(loggedUserJSON)
			setUser(userLogged)
			noteService.setToken(userLogged.token)
			return
		}
		setUser(null)
	}, [])

	const addNote = async (noteObject) => {
		try {
			const returnedNote = await noteService.create(noteObject)
			setNotes(notes.concat(returnedNote))
		}
		catch(error) {
			setErrorMessage('Error adding new note')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	const deleteNote = async (id) => {
		try {
			await noteService.deleteById(id)
			const updatedNotes = notes.filter(note => note.id !== id)
			setNotes(updatedNotes)
		}
		catch(error) {
			setErrorMessage(`Note ${id} could not be deleted`)
			setTimeout(() => {
				setErrorMessage(null)
			}, 10000)
		}
	}

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const userLogged = await loginService.login({ username, password })
			window.localStorage.setItem( 'loggedNoteAppUser', JSON.stringify(userLogged) )
			noteService.setToken(userLogged.token)

			setUser(userLogged)
			setUsername('')
			setPassword('')
		}
		catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	const handleLogout = () => {
		window.localStorage.clear()
		noteService.setToken(null)

		setUser(null)
		setUsername('')
		setPassword('')
	}

	return (
		<div>
			<h1 className='title'>NOTES</h1>
			{
				user
					?  <NoteForm
						username={user.name}
						handleLogout={handleLogout}
						addNote={addNote}
					/>
					: 	<LoginForm
						username={username}
						password={password}
						handleUserChange={({ target }) => setUsername(target.value)}
						handlePasswordChange={({ target }) => setPassword(target.value)}
						handleLogin={handleLogin}
					/>
			}
			<Notification message={errorMessage} />
			{
				user
					?	<NotesCollection
						notes={notes}
						setNotes={setNotes}
						setErrorMessage={setErrorMessage}
						userLogged = {user.username}
						setModifiedNotes = {setModifiedNotes}
						deleteNote = {deleteNote}
					/>
					: ''
			}
		</div>
	)
}

export default App