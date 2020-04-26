import { Button, Card, FormGroup, H1, InputGroup, Spinner } from '@blueprintjs/core'
import React, { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { authMiddleWare } from '../../util/auth'

interface Props extends RouteComponentProps {}

export const Account: FC<Props> = props => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [username, setUsername] = useState('')
  const [country, setCountry] = useState('')
  const [uiLoading, setUiLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    authMiddleWare(props.history)

    const authToken = localStorage.getItem('AuthToken') || ''

    fetch('/user', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => response.json())
      .then(response => {
        setFirstName(response.userCredentials.firstName)
        setLastName(response.userCredentials.lastName)
        setEmail(response.userCredentials.email)
        setPhoneNumber(response.userCredentials.phoneNumber)
        setCountry(response.userCredentials.country)
        setUsername(response.userCredentials.username)
        setUiLoading(false)
      })
      .catch(error => {
        if (error.status === 403) {
          props.history.push('/login')
        }
        console.log(error)
        setErrorMsg('Error in retrieving the data')
      })
  }, [props.history])

  const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value)
  }
  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value)
  }
  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const handleChangePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }
  const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }
  const handleChangeCountry = (event: ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value)
  }

  const updateFormValues = (event: MouseEvent) => {
    event.preventDefault()

    setButtonLoading(true)

    authMiddleWare(props.history)

    const authToken = localStorage.getItem('AuthToken') || ''

    const formRequest = { firstName, lastName, country }

    fetch('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify(formRequest),
    })
      .then(response => response.json())
      .then(() => {
        setButtonLoading(false)
      })
      .catch(error => {
        console.log(error)
        if (error.status === 403) {
          props.history.push('/login')
        }
        setButtonLoading(false)
      })
  }

  return uiLoading ? (
    <Spinner size={150} />
  ) : (
    <div>
      <H1>
        {firstName} {lastName}
      </H1>

      <Card>
        <form>
          <FormGroup label={'First Name'} labelFor={'firstName'}>
            <InputGroup
              id={'firstName'}
              name={'firstName'}
              value={firstName}
              required
              onChange={handleChangeFirstName}
            />
          </FormGroup>
          <FormGroup label={'Last Name'} labelFor={'lastName'}>
            <InputGroup id={'lastName'} name={'lastName'} value={lastName} required onChange={handleChangeLastName} />
          </FormGroup>
          <FormGroup label={'Email Address'} labelFor={'email'}>
            <InputGroup
              id={'email'}
              name={'email'}
              value={email}
              autoComplete={'email'}
              disabled
              required
              onChange={handleChangeEmail}
            />
          </FormGroup>
          <FormGroup label={'Phone'} labelFor={'phoneNumber'}>
            <InputGroup
              id={'phoneNumber'}
              name={'phoneNumber'}
              value={phoneNumber}
              pattern={'[7-9]{1}[0-9]{9}'}
              required
              disabled
              onChange={handleChangePhoneNumber}
            />
          </FormGroup>
          <FormGroup label={'User Name'} labelFor={'username'}>
            <InputGroup
              id={'username'}
              name={'username'}
              value={username}
              required
              disabled
              onChange={handleChangeUsername}
            />
          </FormGroup>
          <FormGroup label={'Country'} labelFor={'country'}>
            <InputGroup id={'country'} name={'country'} value={country} required onChange={handleChangeCountry} />
          </FormGroup>
        </form>
      </Card>
      <Button
        type="submit"
        onClick={updateFormValues}
        disabled={!(firstName && lastName && country) || buttonLoading}
        loading={buttonLoading}
      >
        {'Save details'}
      </Button>

      {errorMsg && <p>{errorMsg}</p>}
    </div>
  )
}
