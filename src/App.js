import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import loginService from './services/login'

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

	const handleNoteChange = (event) => {
		setNewNote(event.target.value)
	}

	const handleUserChange = (event) => {
		setUsername(event.target.value)
	}

	const handlePasswordChange = (event) => {
		setPassword(event.target.value)
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

	// pasar a componente
	const renderLoginForm = () => (
		<form className='loginForm' onSubmit={handleLogin}>
			<label htmlFor='Username'>Username</label>
			<input type='text' value={username} name='Username' placeholder='Enter your username' onChange={handleUserChange}></input>
			<br/>
			<label htmlFor='Password'>Password</label>
			<input type='password' value={password} name='Password' placeholder='Enter your password' onChange={handlePasswordChange}></input>
			<br/>
			<button type="submit"><span>Submit</span></button>
		</form>
	)

	// pasar a componente
	const renderNotesForm = () => (
		<form onSubmit={addNote} className='newNoteForm'>
			<input value={newNote} onChange={handleNoteChange} placeholder='type a new note'/>
			<button type="submit">save</button>
		</form>
	)
  
	const notesToShow = showAll
		? notes
		: notes.filter(note => note.important)

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			{ 
				user === null 
				? renderLoginForm() 
				: 
				<div className='logged-content' id='top-content'>
					<span>
						Welcome { user.name } !
						&nbsp;
						<button onClick={handleLogout}>
							Log-out
						</button>
					</span>
					{renderNotesForm()}
				</div>
			}
			<br/>
			{
				user !== null ?
				<div className='logged-content'> 
					<div className='important-button'>
						<button onClick={() => setShowAll(!showAll)}>
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
				: ''
			}
		</div>
	)
}

export default App 