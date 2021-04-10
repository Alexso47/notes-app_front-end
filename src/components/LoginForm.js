import React from 'react';
import '../css/LoginForm.css'

const LoginForm = ({handleLogin, handleUserChange, handlePasswordChange, username, password}) => {
    return (
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
}

export default LoginForm