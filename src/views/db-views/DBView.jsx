import React from 'react'
import { Outlet } from 'react-router-dom'

import { actions, loadingState, StateProvider } from '../../state'

import { Systems } from '../../components/db-components/Systems'
import { Header } from '../../components/db-components/Header'

import '../../index.css'

export function DBView() {
	const initialState = {
		user: null,
		loginDialogOpen: false,
		createDBDialogOpen: false,
		addDBDialogOpen: false,
		programs: [],
		program: false,
		db: null,
		entries: [],
		orbitdbStatus: 'Starting',
		ipfsStatus: 'Starting',
		loading: {
			programs: false,
		},
	}

	const reducer = (state, action) => {
		switch (action.type) {
			case actions.SYSTEMS.SET_ORBITDB:
				return {
					...state,
					orbitdbStatus: action.orbitdbStatus,
				}
			case actions.SYSTEMS.SET_IPFS:
				return {
					...state,
					ipfsStatus: action.ipfsStatus,
				}
			case actions.PROGRAMS.SET_PROGRAM:
				return {
					...state,
					program: action.program,
				}
			case actions.PROGRAMS.SET_PROGRAM_LOADING:
				return {
					...state,
					program: loadingState,
				}
			case actions.PROGRAMS.SET_PROGRAMS:
				return {
					...state,
					programs: action.programs,
				}
			case actions.DB.SET_DB:
				return {
					...state,
					db: action.db,
					entries: action.entries,
				}
			case actions.DB.OPEN_ADDDB_DIALOG:
				return {
					...state,
					addDBDialogOpen: true,
				}
			case actions.DB.CLOSE_ADDDB_DIALOG:
				return {
					...state,
					addDBDialogOpen: false,
				}
			case actions.PROGRAMS.SET_PROGRAMS_LOADING:
				return {
					...state,
					loading: { ...state.loading, programs: action.loading },
				}
			default:
				return state
		}
	}

	/*
	 * DO NOT TOUCH
	 * This is allowing the database screen to load the UI properly even if the window is refreshed on it
	 * This is a workaround for the issue of the database screen not loading properly when the window is refreshed
	 * This needs to be fixed in the future
	 */
	const [loadSystems, setLoadSystems] = React.useState(false)

	React.useEffect(() => {
		setLoadSystems(true)
	}, [])

	return (
		<StateProvider initialState={initialState} reducer={reducer}>
			<Header />
			{loadSystems && <Systems />}
			<Outlet />
		</StateProvider>
	)
}
