import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './views/home';
import Play from './views/play'
import fof from './views/404';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/play" component={Play} />
      <Route path="/*" component={fof} />
    </Switch>
  </Router>
);

export default App;