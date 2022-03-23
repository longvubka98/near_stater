import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Owner({ currentUser, contract }) {

    const [listWhitelistApply, setListWhitelistApply] = useState([])
    const [listWhitelisted, setListWhitelised] = useState([])

    const [accountIdRemove, setAccountIdRemove] = useState('')
    const [accountIdAddWhitelist, setAccountIdAddWhitelist] = useState('')

    const [accountIdRegistrationRemove, setAccountIdRegistrationRemove] = useState('')
    const [accountIdAddRegistrationWhitelist, setAccountIdAddRegistrationWhitelist] = useState('')

    useEffect(() => {
        getListData()
    }, [])

    const getListData = () => {
        contract.get_list_registration_whitelist().then(setListWhitelistApply)
        contract.get_list_whitelisted().then(setListWhitelised)
    }

    const randomWhitelist = () => {
    }

    const addRegistrationWhitelist = () => {
        contract.add_registration_whitelist({
            account_ids: [accountIdAddRegistrationWhitelist]
        }).then(data => getListData())
    }

    const removeRegistrationWhitelist = () => {
        contract.remove_registration_whitelist({
            account_ids: [accountIdRegistrationRemove]
        }).then(data => getListData())
    }

    const addWhitelist = () => {
        contract.add_whitelist({
            account_ids: [accountIdAddWhitelist]
        }).then(data => getListData())
    }

    const removeWhitelist = () => {
        contract.remove_whitelist({
            account_ids: [accountIdRemove]
        }).then(data => getListData())
    }

    return (
        <div>
            <h4>Hello boss {currentUser.accountId} !</h4>
            <h4>List apply to whitelist</h4>
            {listWhitelistApply.length == 0 && <p>Not yet</p>}
            {listWhitelistApply.map(item => <p>{item}</p>)}

            <h4>List whitelisted</h4>
            {listWhitelisted.length == 0 && <p>Not yet</p>}
            {listWhitelisted.map((item, index) => <p key={index.toString()}>{item}</p>)}
            <p>Number of whitelisted: {listWhitelisted.length}</p>

            <div className='mt28' />
            <p>Add account id to registration whitelist</p>
            <p className="highlight">
                <label htmlFor="message">AccountId:</label>
                <input
                    value={accountIdAddRegistrationWhitelist}
                    autoComplete="off"
                    id="add_registration_whitelist"
                    onChange={evt => setAccountIdAddRegistrationWhitelist(evt.target.value)}
                />
            </p>
            <button onClick={addRegistrationWhitelist}>
                Add
            </button>
            <p>Remove account id from registration whitelist</p>
            <p className="highlight">
                <label htmlFor="message">AccountId:</label>
                <input
                    autoComplete="off"
                    value={accountIdRegistrationRemove}
                    id="removeregistration_registration_whitelist"
                    onChange={evt => setAccountIdRegistrationRemove(evt.target.value)}
                />
            </p>
            <button onClick={removeRegistrationWhitelist}>
                Remove
            </button>

            <div className='mt28' />
            <p>Add account id to whitelist</p>
            <p className="highlight">
                <label htmlFor="message">AccountId:</label>
                <input
                    value={accountIdAddWhitelist}
                    autoComplete="off"
                    id="add_whitelist"
                    onChange={evt => setAccountIdAddWhitelist(evt.target.value)}
                />
            </p>
            <button onClick={addWhitelist}>
                Add
            </button>
            <p>Remove account id from whitelist</p>
            <p className="highlight">
                <label htmlFor="message">AccountId:</label>
                <input
                    autoComplete="off"
                    value={accountIdRemove}
                    id="remove_whitelist"
                    onChange={evt => setAccountIdRemove(evt.target.value)}
                />
            </p>
            <button onClick={removeWhitelist}>
                Remove
            </button>

            <div className='mt28' />
            <p>Random list whitelist</p>
            <button onClick={randomWhitelist}>Random</button>
        </div>
    )

}

Owner.propTypes = {
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