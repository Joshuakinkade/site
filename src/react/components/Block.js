import React from 'react';

class Block extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
  }

  handleDragStart(evt) {
    evt.dataTransfer.setData('text/html', '<p>Test</p>');
    this.props.onDragStart(this.props.block.get('id'));
    this.setState({dragging: true});
  }

  handleDragEnd(evt) {
    this.setState({dragging: false});
  }

  handleDragOver(evt) {
    this.props.onDragOver(this.props.block.get('id'));
  }

  render() {
    const style = {
      backgroundColor: 'gray',
      height: this.props.block.get('height'),
      gridColumnStart: this.props.block.get('start'),
      gridColumnEnd: this.props.block.get('end'),
      opacity: this.state.dragging ? .5 : 1
    };

    return (
      <div className="Block" 
           style={style}
           draggable={this.props.editable} 
           onDragStart={this.handleDragStart}
           onDragEnd={this.handleDragEnd}
           onDragOver={this.handleDragOver}>
        <div className="edit-bar">
          <button type="button" className="options">i</button>
        </div>
        <div className="content">
          {this.props.block.get('label')}
        </div>
      </div>
    );
  }
}

export default Block;