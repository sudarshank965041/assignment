export const setAuthToken = (token) => {
   localStorage.setItem('authToken',token)
}

export const getAuthToken = () => {
    return localStorage.getItem('authToken')
}

export const setUserData = (user) => {
    localStorage.setItem('user',JSON.stringify(user))
}

export const getUserData = () => {
    return JSON.parse(localStorage.getItem('user'))
}

export const logout = () => {
    localStorage.clear()

}

export default {
    setAuthToken,
    getAuthToken,
    setUserData,
    getUserData,
    logout
}