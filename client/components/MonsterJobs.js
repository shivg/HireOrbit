import React from 'react';
import Iframe from 'react-iframe'

class MonsterFrame extends React.Component {
  constructor(props){
    super(props);
    
    console.log("monster jobs: ", this.props);

    var q, where;

    if (!this.props.query.q) {
      q = "Software-Engineer";
      where = "San-Francisco";
    } else {
      q = this.props.query.q.split(" ").join("-") || "Software-Engineer";
      where = this.props.query.l.split(" ").join("-") || "San-Francisco";
    }

    this.state = {
      iframeURL: `http://jobs.monster.com/search/?q=${q}&where=${where}`
    };
  }


  onClickDice() {
    var q = this.props.query.q.split(" ").join("+") || "Software+Engineer";
    var where = this.props.query.l.split(" ").join("+") || "San+Francisco";

    this.setState({
      iframeURL: `https://www.dice.com/jobs?q=${q}&l=${where}`
    })
  }

  onClickMonster() {
    var q = this.props.query.q.split(" ").join("-") || "Software-Engineer";
    var where = this.props.query.l.split(" ").join("-") || "San-Francisco";

    this.setState({
      iframeURL: `http://jobs.monster.com/search/?q=${q}&where=${where}`
    })
    
  }
  render(){
    return (
      <div className="iframe__container">
        <div className="nav">
          <div onClick={this.onClickMonster.bind(this)} className="iframe-site-name">Monster</div>
          <div onClick={this.onClickDice.bind(this)} className="iframe-site-name">Dice</div>
        </div>
        <div className='iframe'>
          <Iframe url={this.state.iframeURL} />
        </div>
      </div>
    )
  }
 
}

export default MonsterFrame;