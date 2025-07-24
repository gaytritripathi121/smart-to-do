import React from 'react';

const FilterBar = ({ filter, setFilter }) => {
  const filters = ['All', 'Completed', 'Pending'];

  return (
    <div className="btn-group mb-3" role="group">
      {filters.map(f => (
        <button
          key={f}
          type="button"
          className={`btn btn-outline-primary ${filter === f ? 'active' : ''}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
