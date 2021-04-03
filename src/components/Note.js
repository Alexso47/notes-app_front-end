import React from 'react'

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <div className='note-content'>{note.content}</div>
      <button className='toggleImportance' onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note