import React from 'react';
import { Table, TableBody, TableHead, TableCell, TableRow, TableContainer, Paper, TableFooter } from '@material-ui/core';
import { API_PREFIX } from '../../Consts';
import axios from 'axios';
import DataTable from '../DataTableContetnLoader/DataTable';
import { connect } from 'react-redux';
import { addUser, setUsers, updateUser } from '../../store/usersReducer/usersReducer';
import PaginationBlock from '../PaginationBlock/paginationBlock'
import TablePagination from '@material-ui/core/TablePagination';
import './usersList.css'
import { ArrowDownward, ArrowUpward, Edit, HighlightOff, Search } from '@material-ui/icons'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import { UserDialog } from '../UserDialog/userDialog';

export class UsersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoading: true,
            users: null,
            page: 0,
            rowsPerPage: 5,
            orderDirection: null,
            searchValue: '',
            openDialog: false,
            currentId: 'new'
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.sortUsers = this.sortUsers.bind(this);
        this.openUserDialog = this.openUserDialog.bind(this);
        this.closeUserDialog = this.closeUserDialog.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.users !== this.props.users && prevProps.users) {
            const { orderDirection } = this.state;
            this.setState({
                users: this.sortUsers(orderDirection, this.props.users)
            });
        }
    }

    handlePageChange(event, newPage) {
        this.setState({
            page: newPage
        });
    }

    handleRowsPerPageChange(event) {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        })
    }

    handleOrderClick() {
        const newOrderDirection = this.state.orderDirection === 'down' ? 'up' : 'down';
        this.setState({
            users: this.sortUsers(newOrderDirection),
            orderDirection: newOrderDirection
        })
    }

    handleSearchChange(event) {
        this.setState({
            searchValue: event.target.value
        });
    }

    handleSearch(event) {
        event.preventDefault();
        this.setState({
            users: this.props.users.filter((el) => el.username.includes(this.state.searchValue)),
            page: 0
        });
    }

    openUserDialog(user = {}) {
        this.setState({
            currentId: user.id ? user.id : 'new',
            openDialog: true
        })
    }

    closeUserDialog() {
        this.setState({
            openDialog: false
        })
    }

    sortUsers(order, users = []) {
        const array = users.length > 0 ? users.slice() : this.state.users.slice();
        if(order === null)
            return array;
        const direction = order === 'up' ? -1 : 1;
        return array.sort((a, b) => {
            if (a.id > b.id)
                return direction;
            if (a.id < b.id)
                return -1 * direction;
            return 0;
        })
    }

    getData() {
        this.setState({
            isDataLoading: true
        });
        const url = API_PREFIX + 'api/v1/users/';
        axios.get(url, {
            headers: {
                Authorization: 'Token ' + this.props.token
            }
        })
            .then((response) => {
                this.setState({
                    isDataLoading: false,
                    users: response.data
                });
                this.props.setUsers({ users: response.data });
            })
            .catch((err) => console.log(err))
    }

    static formDate(date) {
        const array = new Date(date).toString().split(' ');
        return [array[2], array[1], array[3], array[4]].join(' ');
    }

    render() {
        const { users, page, rowsPerPage, isDataLoading, orderDirection, openDialog, currentId } = this.state;
        const { token, addUser, updateUser } = this.props;
        const orderArrow = orderDirection === 'up' ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>;
        return (
            isDataLoading ? <DataTable /> :(
                <div>
                <UserDialog
                    open={openDialog}
                    id={currentId}
                    token={token}
                    onClose={this.closeUserDialog}
                    addUser={addUser}
                    updateUser={updateUser}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className='cell' onClick={this.handleOrderClick}>
                                    { orderArrow }
                                    ID
                                </TableCell>
                                <TableCell className='cell'>username</TableCell>
                                <TableCell className='cell'>First name</TableCell>
                                <TableCell className='cell'>Last name</TableCell>
                                <TableCell className='cell'>Last login</TableCell>
                                <TableCell className='cell' />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0 ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users)
                                .map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className='cell' title='User ID'>{user.id}</TableCell>
                                        <TableCell className='cell' title={user.username}>{user.username}</TableCell>
                                        <TableCell className='cell' title={user.first_name}>{user.first_name}</TableCell>
                                        <TableCell className='cell' title={user.last_name}>{user.last_name}</TableCell>
                                        <TableCell className='cell'>{user.last_login ? UsersTable.formDate(user.last_login) : 'Never'}</TableCell>
                                        <TableCell>
                                            <ButtonGroup>
                                                <IconButton onClick={() => this.openUserDialog(user)} size='small' color='primary'><Edit /></IconButton>
                                                <IconButton size='small' color='secondary'><HighlightOff /></IconButton>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                        <TableFooter className='table_footer'>
                            <TableRow>
                                <TableCell>
                                    <Button
                                        colSpan={1}
                                        variant='contained'
                                        className='addUser'
                                        color='primary'
                                        onClick={this.openUserDialog}
                                    >
                                        Add user
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <form onSubmit={this.handleSearch}>
                                        <Input
                                            type='search'
                                            colSpan={3}
                                            value={this.state.searchValue}
                                            onChange={this.handleSearchChange}
                                            startAdornment={
                                                <InputAdornment position='start' onClick={this.handleSearch}>
                                                    <Search/>
                                                </InputAdornment>
                                            }
                                        />
                                    </form>
                                </TableCell>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: users.length }]}
                                    rowsPerPage={rowsPerPage}
                                    colSpan={5}
                                    count={users.length}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={this.handlePageChange}
                                    onChangeRowsPerPage={this.handleRowsPerPageChange}
                                    ActionsComponent={PaginationBlock}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                </div>
                ))
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token.token,
        users: state.users.users
    }
};

const mapDispatchToProps = {
    setUsers,
    addUser,
    updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);