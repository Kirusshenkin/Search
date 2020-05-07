import React, {useReducer} from 'react'
import axios from 'axios'
import { GithubContext } from './guthubContext'
import { githubReducer } from './githubReducer'
import { SEARCH_USERS, GET_USER, GET_REPOS, CLEAR_USERS, SET_LOADING } from '../types'


const CLEINT_ID = process.env.REACT_APP_CLEINT_ID
const CLEINT_SECRET = process.env.REACT_APP_CLEINT_SECRET

const withCreds = url => {
    return `${url}client_id=${CLEINT_ID}&client_secret=${CLEINT_SECRET}`
}


export const GithubState = ({children}) => {
    const initialState = {
        user: {},
        users: [],
        loading: false,
        repos: []
    }
    const [state, dispatch] = useReducer(githubReducer, initialState)

    const search = async value => {
        setLoading()

        const response = await axios.get(
            withCreds(`https://api.github.com/search/users?q=${value}&`)
        )

        dispatch({
            type: SEARCH_USERS,
            payload: response.data.items
        })
    }

    const getUser = async name => {
        setLoading()

        const response = await axios.get(
            withCreds(`https://api.github.com/users/users/${name}?`)
        )

        dispatch({
            type: GET_USER,
            payload: response.data
        })
    }
    const getRepos = async name => {
        setLoading()
        
        const response = await axios.get(
            withCreds(`https://api.github.com/users/users/${name}/repos?per_page=5&`)
        )

        dispatch({
            type: GET_REPOS,
            payload: response.data
        })
    }

    const clearUsers = () => dispatch({type: CLEAR_USERS})

    const setLoading = () => dispatch({type: SET_LOADING})

    const {user, users, repos, loading} = state

    return (
        <GithubContext.Provider value={{
            setLoading, search, getUser, getRepos, clearUsers,
            user, users, repos, loading
        }}>
            {children}
        </GithubContext.Provider>
    )
}