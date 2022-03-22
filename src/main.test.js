beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['is_owner', 'get_list_registration_whitelist', 'get_list_whitelisted', 'is_registration_whitelisted', 'is_whitelisted'],
    changeMethods: ['tranfer_owner', 'add_registration_whitelist', 'remove_registration_whitelist', 'add_whitelist', 'remove_whitelist'],
    sender: window.accountId
  })

  window.walletConnection = {
    requestSignIn() {
    },
    signOut() {
    },
    isSignedIn() {
      return true
    },
    getAccountId() {
      return window.accountId
    }
  }
})

test('test_owner', async () => {
  // const message = await window.contract.is_owner({ account_id: window.accountId })
  // expect(message).toEqual(true)
})
