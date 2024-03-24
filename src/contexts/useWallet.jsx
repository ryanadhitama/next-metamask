import React, { createContext, useContext, useEffect, useState } from 'react'

const { ethereum } = typeof window !== 'undefined' ? window : {}

const WalletContext = createContext({
  account: undefined,
  error: undefined,
  connect: () => {},
})

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(null)

  const isEthereumExists = () => {
    if (!ethereum) {
      return false
    }
    return true
  }

  const checkWalletConnect = async () => {
    if (isEthereumExists()) {
      try {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        })
        setAccount(accounts[0])
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const connect = async () => {
    setError('')
    if (isEthereumExists()) {
      try {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAccount(accounts[0])
      } catch (err) {
        setError(err.message)
      }
    } else {
      setError('Please Install MetaMask.')
    }
  }

  useEffect(() => {
    checkWalletConnect()
  }, [checkWalletConnect])

  return (
    <WalletContext.Provider value={{ account, connect, error }}>
      {children}
    </WalletContext.Provider>
  )
}

const useWallet = () => useContext(WalletContext)

export default useWallet
