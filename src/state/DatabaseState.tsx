import React, { createContext, useReducer, useContext } from 'react'

export const StateContext = createContext()

export function StateProvider({ reducer, initialState, children }) {
	return (
		<StateContext.Provider value={useReducer(reducer, initialState)}>
			{children}
		</StateContext.Provider>
	)
}

export const useStateValue = () => useContext(StateContext)

export const actions = {
	DB: {
		OPEN_ADDDB_DIALOG: 'OPEN_ADDDB_DIALOG',
		CLOSE_ADDDB_DIALOG: 'CLOSE_ADDDB_DIALOG',
		SET_DB: 'SET_DB',
	},
	SYSTEMS: {
		SET_IPFS: 'SET_IPFS',
		SET_ORBITDB: 'SET_ORBITDB',
	},
	PROGRAMS: {
		SET_PROGRAMS: 'SET_PROGRAMS',
		SET_PROGRAMS_LOADING: 'SET_PROGRAMS_LOADING',
		SET_PROGRAM: 'SET_PROGRAM',
		SET_PROGRAM_LOADING: 'SET_PROGRAM_LOADING',
	},
}

export const loadingState = 'loading'
