import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import React from "react";
import LoginPage from "../loginPage/loginPage";
import UsersTable from "../UsersList/usersList";
import { connect } from "react-redux";

export const AppRouter = (props) => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/login' component={ LoginPage }/>
            <Route path='/users' render={() => (
                props.token !== null ?  (<UsersTable token={props.token}/>) : (<Redirect to='/login'/>)
            )}/>
            <Redirect from='/' to='/login' />
        </Switch>
    </BrowserRouter>
);

const mapStateToProps = (state) => {
    return {
        token: state.token.token
    }
};

export default connect(mapStateToProps)(AppRouter);