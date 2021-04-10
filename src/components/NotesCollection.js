import React, {useState, useEffect} from 'react';
import '../css/NotesCollection.css'
import Note from './Note'
import noteService from '../services/notes'
import Togglable from './Togglable';

const NotesCollection = ({notes, setNotes, setErrorMessage}) => {
    const [showAll, setShowAll] = useState(true)
    const [filter, setFilter] = useState('')
    const [userFilter, setUserFilter] = useState('')
    const [notesToShow, setNotesToShow] = useState(notes)
    const [sortByDate, setSortByDate] = useState(0)

    useEffect(() => {
        let notesFiltered = showAll ? notes : notes.filter(note => note.important)
        notesFiltered = notesFiltered.filter(note => {
            return note.content.toLowerCase()
                        .includes(filter.toLowerCase())
        })

        if(userFilter !== '')
        {
            notesFiltered = notesFiltered.filter(note => {
                return note.user.name.toLowerCase()
                        .includes(userFilter.toLowerCase())
            })
        }

        if(sortByDate !== 0) {
            const sortedNotes = notesFiltered.sort((a,b) => {
                return new Date(a.date).getTime() - 
                    new Date(b.date).getTime()
            })
            notesFiltered = sortByDate === 1 ? sortedNotes : sortedNotes.reverse()
        }

		setNotesToShow(notesFiltered)
	}, [filter, showAll, notes, sortByDate, userFilter])

    const toggleImportanceOf = async (id) => {
        
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }
        
        try {
            const returnedNote = await noteService.update(id, changedNote)
            setNotes(notes.map(note => note.id !== id ? note : returnedNote))
        }
        catch(error) {
            setErrorMessage(`Note ${note.content} could not be updated`)
            setTimeout(() => {
                setErrorMessage(null)
            }, 10000)   
        }
        
    }

    const filterByContent = (event) => {
        setFilter(event.target.value)
    }

    const filterByUser = (event) => {
        setUserFilter(event.target.value)
    }

    const changeSortByDate = () => {
        if(sortByDate === 0) {
            setSortByDate(1)
        }
        else if (sortByDate === 1){
            setSortByDate(2)
        }
        else if (sortByDate === 2){
            setSortByDate(1)
        }
    }

    const clearFilter = () => {
        setSortByDate(0)
        setFilter('')
        setUserFilter('')
        setShowAll(true)
    }

    let sortDateLabel = sortByDate === 0 
        ? ''
        : sortByDate === 1
            ? 'asc' 
            : 'desc'
    
    return (
        <div className='logged-content'> 
            <Togglable buttonLabel='Filters'>
                <div className='filters'>
                    <button className='filter-button' onClick={() => setShowAll(!showAll)}>
                        show {showAll ? 'IMPORTANT' : 'ALL' }
                    </button>
                    <button className='filter-button' onClick={changeSortByDate}>
                        sort by DATE {sortDateLabel}
                    </button>
                    <input value={filter} onChange={filterByContent} placeholder='filter by CONTENT'/>
                    <input value={userFilter} onChange={filterByUser} placeholder='filter by USER'/>
                    <button className='filter-button' id='clear-button' onClick={clearFilter} title='Clear'>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </Togglable>
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