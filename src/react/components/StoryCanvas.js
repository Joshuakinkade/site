import React, {Component} from 'react';
import { fromJS } from 'immutable';

import Block from './Block';
import { getBlock, getBlockIndex, moveBlock } from '../../lib/blocks';

export default class StoryCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 4,
      editing: true,
      canvasStyle: {
        gridTemplateColumns: 'repeat(4, 1fr)'
      },
      pendingBlock: null,
      blocks: fromJS([
        {
          id: 1,
          label: 'Hello',
          order: 0,
          width: 2,
          height: '256px',
          dragging: false
        },{
          id: 2,
          label: 'World',
          order: 1,
          width: 2,
          height: '256px',
          dragging: false
        },{
          id: 3,
          label: 'Block 3',
          order: 2,
          width: 1,
          height: '256px',
          dragging: false
        }
      ])
    }

    this.handleBlockDrag = this.handleBlockDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleBlockDragOver = this.handleBlockDragOver.bind(this);
  }

  handleBlockDrag(blockId) {
    const block = getBlock(this.state.blocks ,blockId);
    this.setState({pendingBlock: block.get('id')});
  }

  handleDrop() {
    const block = getBlock(this.state.blocks, this.state.pendingBlock);
    this.setState({pendingBlock: null});
  }

  // Allow drop to happen
  handleDragOver(evt) {
    evt.preventDefault();
  }

  // Determine where block is
  handleBlockDragOver(id) {
    if (id !== this.state.pendingBlock) {
      const targetIndex = getBlockIndex(this.state.blocks, id);
      const blocks = moveBlock(this.state.blocks, this.state.pendingBlock, targetIndex);
      this.setState({blocks});
    }
  }

  layoutBlocks() {
    let offset = 0;
    const list = this.state.blocks.map( block => {
      if (offset + block.get('width') > this.state.width) {
        offset = 0;
      }

      block = block
        .set('start',offset + 1)
        .set('end', offset + block.get('width') + 1);

      offset += block.get('width');

      return block;
    });
    return list;
  }

  render() {
    const laidOutBlocks = this.layoutBlocks();

    return (
      <div className="StoryCanvas" 
           style={this.state.canvasStyle} 
           onDrop={this.handleDrop}
           onDragOver={this.handleDragOver}>
        {laidOutBlocks.map( block => 
          <Block block={block} 
                 key={block.get('id')} 
                 editable={this.state.editing}
                 onDragOver={this.handleBlockDragOver}
                 onDragStart={this.handleBlockDrag}/>
        )}
        <button onClick={this.addBlock}>Add</button>
      </div>
    );
  }
}

function deleteItem(arr, index) {
  const start = arr.slice(0, index);
  const end = arr.slice(index+1);

  return start.concat(end);
}