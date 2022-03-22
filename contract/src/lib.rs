use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, near_bindgen, AccountId};
use std::vec::Vec;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]

pub struct WhitelistIdoContract {
    /// The owner account ID. It allows to registration whitelist.
    /// It also allows to registration_whitelist to be whitelisted, which can join the ido sale.
    pub owner_account_id: AccountId,

    /// The whitelisted account IDs, which can join the ido sale.
    pub whitelist: UnorderedSet<AccountId>,

    /// The list of registration whitelist. Any account from this list can be whitelisted
    pub registration_whitelist: UnorderedSet<AccountId>,
}

impl Default for WhitelistIdoContract {
    fn default() -> Self {
        env::panic(b"The contract should be initialized before usage")
    }
}

#[near_bindgen]
impl WhitelistIdoContract {
    /// Initializes the contract with the given owner account ID.
    #[init]
    pub fn new(owner_account_id: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        assert!(
            env::is_valid_account_id(owner_account_id.as_bytes()),
            "The owner account ID is invalid"
        );
        Self {
            owner_account_id,
            whitelist: UnorderedSet::new(b"w".to_vec()),
            registration_whitelist: UnorderedSet::new(b"r".to_vec()),
        }
    }

    // Tranfer owner account ID to new owner account ID.
    // This method can only be called by the owner.
    pub fn tranfer_owner(&mut self, new_owner_account_id: AccountId) -> bool {
        self.assert_called_by_owner();
        assert!(
            env::is_valid_account_id(new_owner_account_id.as_bytes()),
            "The new owner account ID is invalid"
        );
        self.owner_account_id = new_owner_account_id;
        true
    }

    pub fn is_owner(&self, account_id: AccountId) -> bool {
        self.owner_account_id == account_id
    }

    // Return list account ID of registration whitelist
    pub fn get_list_registration_whitelist(&self) -> Vec<AccountId> {
        let mut list_registration_whitelists = Vec::new();
        for i in self.registration_whitelist.iter().enumerate() {
            list_registration_whitelists.push(i.1);
        }
        list_registration_whitelists
    }

    // Return list account ID of whitelisted
    pub fn get_list_whitelisted(&self) -> Vec<AccountId> {
        let mut list_whitelisted = Vec::new();
        for i in self.whitelist.iter().enumerate() {
            list_whitelisted.push(i.1);
        }
        list_whitelisted
    }

    /// Returns `true` if the given account ID is registration_whitelisted.
    pub fn is_registration_whitelisted(&self, registration_account_id: AccountId) -> bool {
        assert!(
            env::is_valid_account_id(registration_account_id.as_bytes()),
            "The given account ID is invalid"
        );
        self.registration_whitelist
            .contains(&registration_account_id)
    }

    /// Returns `true` if the given account ID is whitelisted.
    pub fn is_whitelisted(&self, account_id: AccountId) -> bool {
        assert!(
            env::is_valid_account_id(account_id.as_bytes()),
            "The given account ID is invalid"
        );
        self.whitelist.contains(&account_id)
    }

    /// Adds the given account ID to the registration whitelist.
    /// Returns list of registration_whitelist successfully added.
    /// This method can only be called by the owner.
    pub fn add_registration_whitelist(&mut self, account_ids: Vec<AccountId>) -> Vec<AccountId> {
        self.assert_called_by_owner();

        let mut add_registration_whitelist_account_ids = Vec::new();
        for account_id in account_ids {
            if env::is_valid_account_id(account_id.as_bytes())
                && !self.registration_whitelist.contains(&account_id)
            {
                self.registration_whitelist.insert(&account_id);
                add_registration_whitelist_account_ids.push(account_id);
            }
        }
        add_registration_whitelist_account_ids
    }

    /// Removes the given account ID from the registration whitelist.
    /// Returns list of registration_whitelist successfully removed.
    /// This method can only be called by the owner.
    pub fn remove_registration_whitelist(&mut self, account_ids: Vec<AccountId>) -> Vec<AccountId> {
        self.assert_called_by_owner();

        let mut remove_registration_whitelist_account_ids = Vec::new();
        for account_id in account_ids {
            if env::is_valid_account_id(account_id.as_bytes())
                && self.registration_whitelist.contains(&account_id)
            {
                self.registration_whitelist.remove(&account_id);
                remove_registration_whitelist_account_ids.push(account_id);
            }
        }
        remove_registration_whitelist_account_ids
    }

    /// Adds the given account ID to the whitelist.
    /// Returns list of whitelist successfully added.
    /// This method can only be called by the owner.
    pub fn add_whitelist(&mut self, account_ids: Vec<AccountId>) -> Vec<AccountId> {
        self.assert_called_by_owner();
        let mut add_whitelist_account_ids = Vec::new();
        for account_id in account_ids {
            if env::is_valid_account_id(account_id.as_bytes())
                && !self.whitelist.contains(&account_id)
            {
                self.whitelist.insert(&account_id);
                add_whitelist_account_ids.push(account_id);
            }
        }
        add_whitelist_account_ids
    }

    /// Removes the given account ID from the whitelist.
    /// Returns list of whitelist successfully removed.
    /// This method can only be called by the owner.
    pub fn remove_whitelist(&mut self, account_ids: Vec<AccountId>) -> Vec<AccountId> {
        self.assert_called_by_owner();
        let mut remove_whitelist_account_ids = Vec::new();
        for account_id in account_ids {
            if env::is_valid_account_id(account_id.as_bytes())
                && self.whitelist.contains(&account_id)
            {
                self.whitelist.remove(&account_id);
                remove_whitelist_account_ids.push(account_id);
            }
        }
        remove_whitelist_account_ids
    }

    /// Internal method to verify the predecessor was the owner account ID.
    fn assert_called_by_owner(&self) {
        assert_eq!(
            &env::predecessor_account_id(),
            &self.owner_account_id,
            "Can only be called by owner"
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "dragonvu.testnet".to_string(),
            signer_account_id: "dragonvu.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "dragonvu.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    // Test owner after init contract
    fn is_owner() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        assert_eq!(true, contract.is_owner("dragonvu.testnet".to_string()));
    }

    #[test]
    // Test fake owner after init contract
    fn is_owner_fake() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        assert_eq!(false, contract.is_owner("vuongnt.testnet".to_string()));
    }

    #[test]
    // Tranfer owner
    fn tranfer_owner() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        assert_eq!(true, contract.tranfer_owner("vuongnt.testnet".to_string()));
    }

    #[test]
    // Tranfer and check old owner
    fn tranfer_and_check_old_owner() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        contract.tranfer_owner("vuongnt.testnet".to_string());
        assert_eq!(false, contract.is_owner("dragonvu.testnet".to_string()));
    }

    #[test]
    // Tranfer and check old owner
    fn tranfer_and_check_new_owner() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        contract.tranfer_owner("vuongnt.testnet".to_string());
        assert_eq!(true, contract.is_owner("vuongnt.testnet".to_string()));
    }

    #[test]
    // Check initial registration_whitelisted
    fn check_initial_registration_whitelisted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        assert_eq!(
            false,
            contract.is_registration_whitelisted("vuongnt.testnet".to_string())
        );
    }

    #[test]
    // Add registration_whitelisted and check
    fn add_and_check_registration_whitelisted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        contract.add_registration_whitelist(["vuongnt.testnet".to_string()].to_vec());
        assert_eq!(
            true,
            contract.is_registration_whitelisted("vuongnt.testnet".to_string())
        );
    }

    #[test]
    // Add remove and check registration_whitelisted
    fn add_remove_and_check_registration_whitelisted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        contract.add_registration_whitelist(["vuongnt.testnet".to_string()].to_vec());
        contract.remove_registration_whitelist(["vuongnt.testnet".to_string()].to_vec());
        assert_eq!(
            false,
            contract.is_registration_whitelisted("vuongnt.testnet".to_string())
        );
    }


    #[test]
    // Check initial whitelisted
    fn check_initial_whitelisted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        assert_eq!(
            false,
            contract.is_whitelisted("vuongnt.testnet".to_string())
        );
    }

    #[test]
    // Add whitelisted and check
    fn add_and_check_whitelisted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        contract.add_whitelist(["vuongnt.testnet".to_string()].to_vec());
        assert_eq!(
            true,
            contract.is_whitelisted("vuongnt.testnet".to_string())
        );
    }

    #[test]
    // Add remove and check whitelisted
    fn add_remove_and_check_whitelisted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = WhitelistIdoContract::new("dragonvu.testnet".to_string());
        contract.add_whitelist(["vuongnt.testnet".to_string()].to_vec());
        contract.remove_whitelist(["vuongnt.testnet".to_string()].to_vec());
        assert_eq!(
            false,
            contract.is_whitelisted("vuongnt.testnet".to_string())
        );
    }
}