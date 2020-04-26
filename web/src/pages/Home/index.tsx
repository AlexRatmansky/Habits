import { Button, Classes, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Spinner } from '@blueprintjs/core'
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { Account } from '../../components/Account'
import { Habit } from '../../components/Habit'
import { authMiddleWare } from '../../util/auth'

interface Props extends RouteComponentProps {}

export const Home: FC<Props> = props => {
  const [render, setRender] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [uiLoading, setUiLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    authMiddleWare(props.history)
    const authToken: string = localStorage.getItem('AuthToken') || ''

    fetch('/user', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => {
        if (!response.ok) throw response
        return response.json()
      })
      .then(response => {
        setFirstName(response.userCredentials.firstName)
        setLastName(response.userCredentials.lastName)
        setUiLoading(false)
      })
      .catch(error => {
        if (error.status === 403) {
          props.history.push('/login')
          return
        }

        error.json().then((errorMessage: Error) => {
          console.log(errorMessage)
          setErrorMsg('Error in retrieving the data')
        })
      })
  }, [props.history])

  const loadAccountPage = () => {
    setRender(true)
  }

  const loadHabitPage = () => {
    setRender(false)
  }

  const logoutHandler = () => {
    localStorage.removeItem('AuthToken')
    props.history.push('/login')
  }

  return uiLoading ? (
    <Spinner size={150} />
  ) : (
    <div>
      <h1>{'HabitApp'}</h1>
      <p>
        {firstName} {lastName}
      </p>

      <Navbar>
        <NavbarGroup>
          <NavbarHeading>{'Habits-machine'}</NavbarHeading>
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="list" text="Habit List" onClick={loadHabitPage} />
          <Button className={Classes.MINIMAL} icon="document" text="Account" onClick={loadAccountPage} />
          <Button className={Classes.MINIMAL} icon="document" text="Logout" onClick={logoutHandler} />
        </NavbarGroup>
      </Navbar>

      {errorMsg && <p>{errorMsg}</p>}

      <div>{render ? <Account {...props} /> : <Habit {...props} />}</div>
    </div>
  )
}
