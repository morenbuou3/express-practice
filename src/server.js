import 'css-modules-require-hook/preset';
import express from 'express';
import React from 'react';
import path from 'path'
import { renderToString } from 'react-dom/server'
import { StaticRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Homepage from './components/homepage';
import AboutUs from './components/about-us';
import Navigation from './components/navigation';
import Login from './components/login-form';
import ClassList from './components/class-list';
import { authenticationReducer } from './reducers';
import buildPath from '../build/asset-manifest.json';

const app = express();

const store = createStore(combineReducers({
    isAuthenticated: authenticationReducer
}));

app.use((request, response, next) => {
    if (request.url.startsWith('/static')) {
        return next();
    }

    const appString = renderToString(
        <Provider store={store}>
            <StaticRouter context={{}} location={request.url}>
                <div>
                    <Navigation />
                    <Switch>
                        <Route exact path="/" component={Homepage} />
                        <Route path="/about" component={AboutUs} />
                        <Route path="/login" component={Login} />
                        <Route path="/classes" component={ClassList} />
                    </Switch>
                </div>
            </StaticRouter>
        </Provider>
    );
    const html = `<html><body><div id="root">${appString}</div><script src="/${buildPath['main.js']}"></script></body></html>`;
    response.send(html);
});

app.use('/', express.static(path.resolve('build')));

app.listen('9000', () => console.log('SSR Server started'));