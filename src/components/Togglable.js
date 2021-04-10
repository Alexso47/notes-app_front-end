import React, {useState} from 'react'
import '../css/Togglable.css'

const Togglable = ({children, buttonLabel}) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div>
            <div className='toggle-content' style={hideWhenVisible}>
                <button title={buttonLabel} id='buttonShow' className='button-toggle' onClick={toggleVisibility}>
                    {buttonLabel}
                </button>
            </div>
            <div className='toggle-content' style={showWhenVisible}>
                <button title={buttonLabel} id='buttonHide' className='button-toggle' onClick={toggleVisibility}>
                    {buttonLabel}   
                </button>
                <div className='toggle-content-children'>
                    {children}
                </div>
            </div>
        </div>
        
    )
}

export default Togglable