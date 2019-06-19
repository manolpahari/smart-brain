import React from 'react';

const Rank = ({ name, entries }) => {

  return (
    <div>
      <div className="center f3 white">
        {`${name}, your current rank is...`}
      </div>
      <div className="center f2 white">
        {entries}
      </div>
    </div>
  )
}

export default Rank;