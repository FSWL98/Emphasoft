import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { setToken } from '../../store/tokenReducer/tokenReducer';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_PREFIX } from '../../Consts';
import { useHistory } from 'react-router-dom';
import './loginPage.css';

export function LoginPage(props) {
    const [state, setState] = useState({
        username: '',
        password: '',
        passwordEntered: true,
        usernameEntered: true,
        passwordValid: true
    });

    const history = useHistory();

    const handleChange = (ev) => {
        const { id, value } = ev.target;
        setState(prevState => ({
            ...prevState,
            [id]: value,
            [id + 'Entered']: true
        }));
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const url = API_PREFIX + 'api-token-auth/';
        const { username, password } = state;
        setState(prevState => ({
            ...prevState,
            passwordEntered: password !== '',
            usernameEntered: username !== ''
        }));
        if (password === '' || username === '')
            return;
        const body = {
            username,
            password
        };
        axios.post(url, body).then((res) => {
            props.setToken({ token: res.data.token });
            setState(prevState => ({
                ...prevState,
                passwordEntered: true,
                usernameEntered: true,
                passwordValid: true
            }))
        })
            .then(() => history.push('/Emphasoft/users'))
            .catch(() => setState(prevState => ({
                ...prevState,
                passwordValid: false,
                password: ''
            })))
    };
    return (
        <form onSubmit={handleSubmit} className='login-form'>
            <TextField
                onChange={handleChange}
                id='username'
                label='Username'
                variant='outlined'
                size='small'
                value={state.username}
                error={!state.usernameEntered}
                helperText={state.usernameEntered ? '' : 'Enter username'}
            />
            <TextField
                onChange={handleChange}
                id='password'
                label='Password'
                variant='outlined'
                size='small'
                value={state.password}
                error={!state.passwordValid || !state.passwordEntered}
                helperText={state.passwordEntered ? (state.passwordValid ? '' : 'Wrong username of password') : 'Enter password'}
                type='password'/>
            <Button type='submit' variant='contained' color='primary'>Submit</Button>
        </form>
    )
}

const mapDpatchToProps = {
    setToken
};

export default connect(null, mapDpatchToProps)(LoginPage);
