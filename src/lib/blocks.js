

/**
 * Adds a block to the list of blocks.
 * @param {List<Map>} blocks 
 * @param {Map} newBlock 
 * @param {nuber} index 
 * @returns {List<Map>} the updated list
 */
export const addBlock = (blocks, newBlock, index=-1) => {
  if (index < 0) {
    return blocks.push(newBlock);
  } else {
    return blocks.insert(index, newBlock);
  }
}

/**
 * Removes a block from the list of blocks. This assumes that the block ids are
 * unique. If there are duplicates only the first will be deleted.
 * @param {List<Map>} blocks 
 * @param {number} blockId 
 * @returns {List<Map>} the updated list
 */
export const removeBlock = (blocks, blockId) => {
  const index = blocks.findIndex( block => block.get('id') === blockId);
  if (index >= 0) {
    return blocks.delete(index);
  } else {
    return blocks;
  }
}

/**
 * Gets a block from the list
 * @param {*} blocks 
 * @param {*} blockId 
 * @returns {Map|null} the block or null if it isn't found
 */
export const getBlock = (blocks, blockId) => {
  return blocks.find( block => block.get('id') === blockId) || null;
}

/**
 * Gets the index of a block in the list
 * @param {*} blocks 
 * @param {*} blockId 
 * @returns {Map|null} the block index or -1 if it isn't found
 */
export const getBlockIndex = (blocks, blockId) => {
  return blocks.findIndex( block => block.get('id') === blockId);
}

/**
 * Moves a block to a new location in the list
 * @param {*} blocks 
 * @param {*} blockId 
 * @param {*} destIndex 
 * @returns {List<Map>} the updated list
 */
export const moveBlock = (blocks, blockId, destIndex) => {
  const block = getBlock(blocks, blockId);
  blocks = removeBlock(blocks, blockId);
  blocks = addBlock(blocks, block, destIndex);
  return blocks;
}

/**
 * Updates a block in a list
 * @param {*} block 
 * @param {*} blockId 
 * @param {*} data 
 * @returns {List<Map>} the updated list
 */
export const updateBlock = (block, blockId, data) => {

}
