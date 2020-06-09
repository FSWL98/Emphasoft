import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {API_PREFIX} from "../../Consts";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import './userDialog.css';

export class UserDialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            is_active: true,
            errors: {
                userError: false,
                passError: false,
                firstError: false,
                lastError: false
            },
            errorTexts: {
                userText: '',
                passText: '',
                firstText: '',
                lastText: ''
            }
        };
        this.getUser = this.getUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    componentDidMount() {
        if (this.props.id !== 'new') {
            this.getUser();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== 'new' && prevProps.id !== this.props.id) {
            this.getUser();
        }
        else if (this.props.open !== prevProps.open) {
            this.setState({
                username: '',
                password: '',
                first_name: '',
                last_name: '',
                is_active: true,
                errors: {
                    userError: false,
                    passError: false,
                    firstError: false,
                    lastError: false
                },
                errorTexts: {
                    userText: '',
                    passText: '',
                    firstText: '',
                    lastText: ''
                }
            });
        }
    }

    handleChange(event) {
        const { id, value } = event.target;
        this.setState({
            [id]: value
        }, this.validateField(id, value));
    };

    validateField(id, value) {
        switch (id) {
            case 'username':
                if(!value) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            userError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            userText: 'Username is required'
                        }
                    })
                }
                else if (value.length > 150) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            userError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            userText: 'Username is too long'
                        }
                    })
                }
                else if (!value.match(/^[\w.@+-]+$/)) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            userError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            userText: 'Username is wrong'
                        }
                    })
                }
                else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            userError: false
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            userText: ''
                        }
                    })
                }
                break;
            case 'password':
                if(!value) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            passError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            passText: 'Password is required'
                        }
                    })
                }
                else if (value.length > 128) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            passError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            passText: 'Password is too long'
                        }
                    })
                }
                else if (!value.match(/^(?=.*[A-Z])(?=.*\d).{8,}$/)) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            passError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            passText: 'Password is wrong'
                        }
                    })
                }
                else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            passError: false
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            passText: ''
                        }
                    })
                }
                break;
            case 'first_name':
                if (value.length > 30) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            firstError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            firstText: 'First name is too long'
                        }
                    })
                }
                else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            firstError: false
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            firstText: ''
                        }
                    })
                }
                break;
            case 'last_name':
                if (value.length > 150) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            lastError: true
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            lastText: 'Last name is too long'
                        }
                    })
                }
                else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            lastError: false
                        },
                        errorTexts: {
                            ...this.state.errorTexts,
                            lastText: ''
                        }
                    })
                }
                break;
            default:
                break;
        }
    };
    handleChecked(event) {
        const { checked } = event.target;
        this.setState({
            is_active: checked
        })
    };

    getUser() {
        const url = API_PREFIX + 'api/v1/users/' + this.props.id + '/';
        axios.get(url, {
            headers: {
                Authorization: 'Token ' + this.props.token
            }
        })
            .then((response) => {
                this.setState({
                    username: response.data.username,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    is_active: response.data.is_active
                });
            })
            .catch((err) => console.log(err) )
    }

    saveUser() {
        const { username, password, last_name, first_name, is_active } = this.state;
        if (password === '') {
            this.setState({
                errors: {
                    ...this.state.errors,
                    passError: true
                },
                errorTexts: {
                    ...this.state.errorTexts,
                    passText: 'Password is required'
                }
            });
            return;
        }
        if (username === '') {
            this.setState({
                errors: {
                    ...this.state.errors,
                    userError: true
                },
                errorTexts: {
                    ...this.state.errorTexts,
                    userText: 'Username is required'
                }
            });
            return;
        }
        const { addUser, updateUser, id, onClose, token } = this.props;
        const method = id === 'new' ? 'post' : 'put';
        const url = API_PREFIX + 'api/v1/users/' + (id === 'new' ? '' : `${id}/`);
        const data = {
            username,
            password,
            last_name,
            first_name,
            is_active
        };
        axios({
            method,
            url,
            data,
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                if (method === 'post')
                    addUser({ user: response.data});
                else
                    updateUser({ user: response.data, id});
            })
            .catch( (err) => console.log(err));
        onClose();
    }

    render() {
        const { username, password, last_name, first_name, is_active, errors, errorTexts } = this.state;
        const { id, onClose, open } = this.props;
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{id === 'new' ? 'Create' : 'Edit'} user</DialogTitle>
                <DialogContent>
                    <form className='user-form'>
                        <TextField
                            id='username'
                            label='Username'
                            required
                            variant='outlined'
                            size='small'
                            value={username}
                            onChange={this.handleChange}
                            error={errors.userError}
                            helperText={errorTexts.userText}
                        />
                        <TextField
                            id='password'
                            label='Password'
                            required
                            variant='outlined'
                            type='password'
                            size='small'
                            value={password}
                            onChange={this.handleChange}
                            error={errors.passError}
                            helperText={errorTexts.passText}
                        />
                        <TextField
                            id='first_name'
                            label='First name'
                            variant='outlined'
                            size='small'
                            value={first_name}
                            onChange={this.handleChange}
                            error={errors.firstError}
                            helperText={errorTexts.firstText}
                        />
                        <TextField
                            id='last_name'
                            label='Last name'
                            variant='outlined'
                            size='small'
                            value={last_name}
                            onChange={this.handleChange}
                            error={errors.lastError}
                            helperText={errorTexts.lastText}
                        />
                        <FormControlLabel
                            label='Active'
                            control={<Checkbox
                                checked={is_active}
                                id='is_active'
                                color='primary'
                                onChange={this.handleChecked}
                            />}
                            className='is-active-checkbox'
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={onClose}>Cancel</Button>
                    <Button
                        color='primary'
                        variant='contained'
                        disabled={errors.userError || errors.passError || errors.firstError || errors.lastError}
                        onClick={this.saveUser}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}