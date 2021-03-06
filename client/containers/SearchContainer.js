import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateCurrentSearch, updateCurrentQuery, fetchSavedSearches, addCardsToKanban } from '../actions';
import Search from '../components/Search';

class SearchContainer extends Component {
  constructor(){
    super();
  }

  render(){
    return ( <Search {...this.props} /> );
  }
}

function mapStateToProps(state) {
  return {
    currentQuery: state.currentQuery,
    currentSearch: state.currentSearch,
    cardPositions: state.cards.reduce((result, card, index) => {
      result[card.card_id] = index;
      return result;
    }, {})
  }
}

export default connect( mapStateToProps, 
{ updateCurrentSearch,
  updateCurrentQuery,
  fetchSavedSearches,
  addCardsToKanban }
)(SearchContainer);
