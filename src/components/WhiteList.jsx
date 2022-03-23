import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function WhiteList({ currentUser, contract }) {

    const [isRegistrationWhitelisted, setIsRegistrationWhitelisted] = useState(false)
    const [isWhitelisted, setIsWhitelisted] = useState(false)

    const [listWhitelistApply, setListWhitelistApply] = useState([])
    const [listWhitelisted, setListWhitelised] = useState([])

    useEffect(() => {
        try {
            contract.is_registration_whitelisted({
                registration_account_id: currentUser.accountId
            }).then(setIsRegistrationWhitelisted)
            contract.is_whitelisted({
                account_id: currentUser.accountId
            }).then(setIsWhitelisted)

            contract.get_list_registration_whitelist().then(setListWhitelistApply)
            contract.get_list_whitelisted().then(setListWhitelised)
        } catch (error) {
            console.log('error', error)
        }
    }, [])

    return (
        <div>
            <h4>Hello {currentUser.accountId} !</h4>
            <p>{isRegistrationWhitelisted ? 'You are already on the whitelist subscriber list' : 'You are not on the whitelist subscribed list'}</p>
            <p>{isRegistrationWhitelisted ? (isWhitelisted ? 'You are whitelisted' : 'You are not in the whitelist') : ''}</p>
            <h4>List registration to whitelist</h4>
            {listWhitelistApply.map(item => <p>{item}</p>)}
            {listWhitelistApply.length == 0 && <p>Not yet</p>}
            <h4>List whitelisted</h4>
            {listWhitelisted.length == 0 && <p>Not yet</p>}
            {listWhitelisted.map(item => <p>{item}</p>)}
            <p>Number of whitelisted: {listWhitelisted.length}</p>
        </div>
    )

}

WhiteList.propTypes = {
    contract: PropTypes.shape({
        get_list_registration_whitelist: PropTypes.func.isRequired,
        get_list_whitelisted: PropTypes.func.isRequired,
        is_registration_whitelisted: PropTypes.func.isRequired,
        is_whitelisted: PropTypes.func.isRequired,
        is_owner: PropTypes.func.isRequired,
        add_registration_whitelist: PropTypes.func.isRequired,
        add_whitelist: PropTypes.func.isRequired,
        remove_whitelist: PropTypes.func.isRequired,
    }).isRequired,
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
}