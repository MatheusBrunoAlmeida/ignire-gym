import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDTO } from "../dtos/UserDTO";
import { api } from "../service/api";
import { storageUserGet, storageUserRemove, storageUserSave } from "../storage/storageUser";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "../storage/storageAuthToken";

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>
    isLoadginStorageUserData: boolean
    signOut: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState({} as UserDTO)
    const [isLoadginStorageUserData, setIsLoadingStorageUserData] = useState(true)

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        try {
            setIsLoadingStorageUserData(true)

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(userData)
        } catch (error) {
            throw error
        }
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsLoadingStorageUserData(true)
            await storageUserSave(userData)
            await storageAuthTokenSave(token)
        } catch (error) {
            throw error
        }finally{
            setIsLoadingStorageUserData(false)
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password })

            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token)
                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingStorageUserData(false)
        }

    }

    async function signOut() {
        try {
            setIsLoadingStorageUserData(true)
            setUser({} as UserDTO)
            await storageUserRemove()
            await storageAuthTokenRemove()


        } catch (error) {
            throw error
        }
        finally {
            setIsLoadingStorageUserData(false)
        }
    }

    async function loadUser() {
        try {
            setIsLoadingStorageUserData(true)
            const userLogged = await storageUserGet()
            const token = await storageAuthTokenGet()

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token)
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingStorageUserData(false)
        }
    }

    useEffect(() => {
        loadUser()
    }, [])


    return (
        <AuthContext.Provider value={{ user, signIn, isLoadginStorageUserData, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
