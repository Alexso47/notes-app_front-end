// import React from 'react'
// import '../css/PopupConfirm.css'

// const PopupConfirm = ({ message, setConfirmation, action, setDeletePopupShow }) => {

// 	const handleResponse = (response) => {
// 		setConfirmation(response)
// 		action()
// 		setDeletePopupShow(false)
// 	}

// 	return (
// 		<div className='popup-confirm' id='popup'>
// 			<div className='popup-confirm message'>
// 				<span>Are you sure that you want to {message} ?</span>
// 				<button className='popup-confirm options' onClick={() => handleResponse(false)}>No</button>
// 				<button className='popup-confirm options' onClick={() => handleResponse(true)}>Yes</button>
// 			</div>
// 		</div>
// 	)
// }

// export default PopupConfirm