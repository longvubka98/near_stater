import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Owner({ currentUser, contract }) {

    const [listWhitelistApply, setListWhitelistApply] = useState([])
    const [listWhitelisted, setListWhitelised] = useState([])

    const [accountIdRemove, setAccountIdRemove] = useState('')
    const [accountIdAddWhitelist, setAccountIdAddWhitelist] = useState('')

    useEffect(() => {
        try {
            contract.get_list_registration_whitelist().then(setListWhitelistApply)
            contract.get_list_whitelisted().then(setListWhitelised)
        } catch (error) {
            console.log('error', error)
        }
    }, [])

    const getBlockIndex = () => {
        contract.getBlockIndex().then(data => console.log('data', data))
    }

    const addWhitelist = () => {
        contract.add_whitelist({
            account_ids: [accountIdAddWhitelist]
        }).then(data => { })
    }

    const removeWhitelist = () => {
        contract.remove_whitelist({
            account_ids: [accountIdRemove]
        }).then(data => { })
    }

    return (
        <div>
            <h4>Hello boss {currentUser.accountId} !</h4>
            <h4>List apply to whitelist</h4>
            {listWhitelistApply.map(item => <p>{item}</p>)}
            <p>Random list whitelist</p>
            <button onClick={getBlockIndex}>Random</button>
            <h4>List whitelisted</h4>
            {listWhitelisted.length == 0 && <p>Not yet</p>}
            {listWhitelisted.map((item, index) => <p key={index.toString()}>{item}</p>)}
            <p>Number of whitelisted: {listWhitelisted.length}</p>

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