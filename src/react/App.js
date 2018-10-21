import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import AlbumPage from './containers/AlbumPage';
import PhotoPage from './containers/PhotoPage';

const NotFound = (props) => {
  return (<p>Not Found</p>);
}

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/pictures/:albumSlug" render ={() => {
            return <AlbumPage albumId={this.props.albumId} initialState={this.props.initialState} />
          }}/>
          <Route exact path="/pictures/:albumSlug/:fileName" render={() => 
            <PhotoPage/>
          }/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    );
  }
}