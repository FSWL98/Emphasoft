import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import LoginPage from '../LoginPage/loginPage';
import UsersTable from '../UsersList/usersList';
import { connect } from 'react-redux';

export const AppRouter = (props) => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/Emphasoft/login' component={ LoginPage }/>
            <Route path='/Emphasoft/users' render={() => (
                props.token !== null ?  (<UsersTable token={ props.token }/>) : (<Redirect to='/Emphasoft/login'/>)
            )}/>
            <Redirect from='/Emphasoft' to='/Emphasoft/login' />
        </Switch>
    </BrowserRouter>
);

const mapStateToProps = (state) => {
    return {
        token: state.token.token
    }
};

export default connect(mapStateToProps)(AppRouter);