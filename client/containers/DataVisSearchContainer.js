import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDataVis } from '../actions';
import DataVisContainer from '../containers/DataVisContainer';
import dataVisual from '../reducers/index';
import d3 from 'd3';
import Utils from '../utils/Utils';
import Video from '../components/Video';
import _ from 'lodash';

  class DataVisSearchContainer extends Component {
    constructor(props){
      super(props)
      // Declare initial state
        this.state = {
          term: '',
          city1: '',
          top20Cities: [],
        }     
      
      // Bind keyboard input submit to DataVisSearchContainer
      this.onSubmit = this.onSubmit.bind(this);
      // Bind keyboard stateChange to DataVisSearchContainer
      this.stateChange = this.stateChange.bind(this);
    }

    componentWillMount () {
        this.setState({
          term: '',
          city1: '',
          top20Cities: [ 
            'New York', 'Chicago', 'Hartford',
            'Houston', 'Seattle', 'San Francisco', 
            'Santa Rosa', 'Portland', 'Boston',
            'Sacramento', 'Minneapolis', 'Baltimore',
            'Los Angeles,', 'San Diego', 'Denver',
            'New Haven', 'San Jose', 'Washington',
            'Worcester', 'Philadelphia'
          ],
            checkbox1: 'Software Engineer',
            checkbox2: 'Javascript React',
            checkbox3: 'Javascript Angular',
            checkbox4: 'Javascript Backbone'
       });
    }

    componentDidMount() {
      this.promiseQuerySearch('front end developer')
    }
        
    // Change state on each keyboard input
    stateChange (e) {
      // Save name of input in key
      let key = e.target.name;
      // if key exist, change the state value to input value
      this.setState({ [key]: e.target.value });
    }

    // On submit, obtain user job position and city, send data to redux store.
    onSubmit (e) {
       if (this.state[e.target.name]) {
          this.promiseQuerySearch(e.target.value)
        } else {
          this.promiseQuerySearch(this.state.term);
          this.setState({ term: '' });
        }
      // Prevent page refresh    
      e.preventDefault();
    }

    promiseQuerySearch (search) {
      var dataVisArray = [];
      var self = this;
      // Use Asynchronus callback to query search term and city
      var listOfPromises = this.state.top20Cities.map(function (city) {
        return new Promise(function (resolve, reject){
          return Utils.getJobsFromIndeed({q: search, l: city}, resolve, reject);
        });
      });
      // Iterate through array of promises
      Promise.all(listOfPromises)
        .then(function  (arrayOfResponses) {
          // iterate through array of objects
          arrayOfResponses.forEach(function (res) {
            // use object destructuring to obtain data              
            let { location, totalResults, query } = res;
            // Every iteration, push into dataVisArray
            dataVisArray.push({ location, totalResults, query} );
          })
          // Prevent free invocation of keyword 'this' using self.
          self.props.fetchDataVis(dataVisArray);
          // self.setState({term: ''});
        })
        .catch(err => {
          console.log('error in promise: ', err)
        });
    }
    
    // Form data
    render() {
      return (
        <div id="chart">
          <Video />
          <h2 className="dataviz__heading">Top paying cities in tech (2016)</h2>
          <p className="dataviz__subheading">Top paying cities in tech, based on salary and job openings.</p>
          <form onSubmit = { this.onSubmit }>
            <div className="radio-box">
              <div>
                <span className="dataVizForm">{'Software Engineer'}</span>
                <input type="radio" name='checkbox1' value={this.state['checkbox1']}  onChange={ this.onSubmit } />
              </div>
              <div>
                <span className="dataVizForm">{'React JS'}</span>
                <input type="radio" name='checkbox2' value={this.state['checkbox2']}  onChange={ this.onSubmit } />
              </div>
              <div>
                <span className="dataVizForm">{'Angular JS'}</span>
                <input type="radio" name='checkbox3' value={this.state['checkbox3']}  onChange={ this.onSubmit } />
              </div>
              <div>
                <span className="dataVizForm">{'Backbone JS'}</span>
                <input type="radio" name='checkbox4' value={this.state['checkbox4']}  onChange={ this.onSubmit } />
              </div>
            </div>
            <div>
              <input className="searchBar" type="text" placeholder="Search for job" name="term" value={ this.state.term } onChange={ this.stateChange } required/>
            </div>
          </form>
          <DataVisContainer />
        </div>
      );
    }
  };
  // Obtain the action creator fetchDataVis
  function mapToDispatchProps(dispatch) {
    return bindActionCreators({ fetchDataVis: fetchDataVis }, dispatch);
  };
  // Convert DataVisSearchContainer into a Smart Container
  export default connect (null, mapToDispatchProps)(DataVisSearchContainer)