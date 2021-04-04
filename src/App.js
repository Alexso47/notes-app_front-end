import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import NotesCollection from './components/NotesCollection'

const App = () => {
	const [notes, setNotes] = useState([]) 
	const [newNote, setNewNote] = useState('')
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(null)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	useEffect(() => {
		if(user !== null){
			noteService.getAll()
			.then(initialNotes => {
				setNotes(initialNotes)
			})
		}
	}, [user])

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

	const addNote = async (event) => {
		event.preventDefault()
		const noteObject = {
			content: newNote,
			important: Math.random() > 0.5
		}
		
		try {
			const returnedNote = await noteService.create(noteObject)
			setNotes(notes.concat(returnedNote))
			setNewNote('')
		}
		catch(error) {
			setErrorMessage('Error adding new note')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
		
	}

	const toggleImportanceOf = async (id) => {
		const note = notes.find(n => n.id === id)
		const changedNote = { ...note, important: !note.important }
		try {
			const returnedNote = await noteService.update(id, changedNote)
			setNotes(notes.map(note => note.id !== id ? note : returnedNote))
		}
		catch(error) {
			setErrorMessage(`Note ${note.content} was already removed from server`)
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)   
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
  
	const notesToShow = showAll
		? notes
		: notes.filter(note => note.important)

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			{ 
				user === null 
				? <LoginForm 
					username={username} 
					password={password} 
					handleUserChange={({target}) => setUsername(target.value)} 
					handlePasswordChange={({target}) => setPassword(target.value)} 
					handleLogin={handleLogin}
				/> 
				: 
				<NoteForm
					user={user}
					handleLogout={handleLogout}
					addNote={addNote}
					newNote={newNote}
					handleNoteChange={({target}) => setNewNote(target.value)}				
				/>
			}
			<br/>
			{
				user !== null ?
				<NotesCollection
					showAll={showAll}
					notesToShow={notesToShow}
					toggleImportanceOf={toggleImportanceOf}
					changeShowAll={() => setShowAll(!showAll)}
				/>
				: ''
			}
		</div>
	)
}

export default App 