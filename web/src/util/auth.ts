import { History } from 'history'

export const authMiddleWare = (history: History) => {
  const authToken = localStorage.getItem('AuthToken')
  if (authToken === null) {
    history.push('/login')
  }
}
