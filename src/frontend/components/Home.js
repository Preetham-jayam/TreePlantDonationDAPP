import React from 'react';
import DonateAndPlantTree from './Contribute';

const Home = ({ marketplace, account }) => {
  return (
    <div>
      <DonateAndPlantTree marketplace={marketplace}  account={account} />
      
    </div>
  );
};

export default Home;
