import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SignIn from './components/SignIn';
import WhiteList from './components/WhiteList';
import Owner from './components/Owner';

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (currentUser?.accountId)
      contract.is_owner({ account_id: currentUser.accountId }).then(setIsOwner);
  }, [currentUser?.accountId]);

  const signIn = () => {
    wallet.requestSignIn(
      { contractId: nearConfig.contractName }, //contract requesting access
      'White list ido', //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>NEAR Starter</h1>
        {currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      {currentUser
        ? isOwner ? <Owner currentUser={currentUser} contract={contract} />
          : <WhiteList currentUser={currentUser} contract={contract} />
        : <SignIn />
      }
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    get_list_registration_whitelist: PropTypes.func.isRequired,
    get_list_whitelisted: PropTypes.func.isRequired,
    is_registration_whitelisted: PropTypes.func.isRequired,
    is_whitelisted: PropTypes.func.isRequired,
    is_owner: PropTypes.func.isRequired,
    add_registration_whitelist: PropTypes.func.isRequired,
    remove_registration_whitelist: PropTypes.func.isRequired,
    add_whitelist: PropTypes.func.isRequired,
    remove_whitelist: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
