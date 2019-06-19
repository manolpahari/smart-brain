import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {

  if(isSignedIn) {
   return (
    <nav style={{display: 'flex', justifyContent:'flex-end'}}>
      <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal}/>
    </nav>
   ); 
  } else {
    return (
      <nav style={{display: 'flex', justifyContent:'flex-end'}}>
        <p onClick={ () => onRouteChange('signin') }className="f3 pa2 link black dim pointer underline">Sign In</p>
        <p onClick={ () => onRouteChange('register') } className="f3 pa2 link black dim pointer underline">Register</p>
      </nav>
    );
  }
}

export default Navigation;
