module.exports = {
  updateQueryData: (columns) => `${ columns.map((col, index) => `${ col } = $${ index + 1 }`) }`
};
