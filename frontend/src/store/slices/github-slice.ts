/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAppSlice } from '@/utils/create-app-slice'
import { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'


export interface Repository {
  id: number
  name: string
  description: string
  owner: string
  stargazers_count: number
  html_url: string
}

interface GithubState {
  username: string
  repositories: Repository[]
  importedRepositories: Repository[]
  loading: boolean
  error: string | null
}

const initialState: GithubState = {
  username: '',
  repositories: [],
  importedRepositories: [],
  loading: false,
  error: null,
}

export const githubSlice = createAppSlice({
  name: 'github',
  initialState,
  reducers: (create) => ({
    setUsername: create.reducer((state, action: PayloadAction<string>) => {
      state.username = action.payload
    }),
    clearError: create.reducer((state) => {
      state.error = null
    }),
    importRepositories: create.reducer((state, action: PayloadAction<Repository[]>) => {
      state.importedRepositories = action.payload
    }),
    fetchRepositories: create.asyncThunk(
      async (username: string) => {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`)
        return response.data.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          owner: repo.owner.login,
          stargazers_count: repo.stargazers_count,
          html_url: repo.html_url
        }))
      },
      {
        pending: (state) => {
          state.loading = true
          state.error = null
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.repositories = action.payload
        },
        rejected: (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Ocorreu um erro ao buscar os repositórios.'
        },
      }
    ),
    persistImportedRepositories: create.asyncThunk(
      async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await axios.post('http://localhost:3000/api/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      },
      {
        pending: (state) => {
          state.loading = true
          state.error = null
        },
        fulfilled: (state) => {
          state.loading = false
        },
        rejected: (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Ocorreu um erro ao fazer o upload do arquivo.'
        },
      }
    ),
    fetchPersistedRepositories: create.asyncThunk(
      async () => {
        const response = await axios.get('http://localhost:3000/api/all')
        return response.data
      },
      {
        pending: (state) => {
          state.loading = true
          state.error = null
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.importedRepositories = Array.isArray(action.payload) ? action.payload : []
        },
        rejected: (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Ocorreu um erro ao buscar os repositórios persistidos.'
        },
      }
    ),
  }),
})

export const { setUsername, clearError, importRepositories, fetchRepositories, persistImportedRepositories, fetchPersistedRepositories } = githubSlice.actions
export default githubSlice.reducer

