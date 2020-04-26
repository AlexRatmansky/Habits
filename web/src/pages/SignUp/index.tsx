import { Button, Card, FormGroup, H1, InputGroup, Intent, Text } from '@blueprintjs/core'
import React, { ChangeEvent, FC, MouseEvent, useState } from 'react'
import { RouteComponentProps } from 'react-router'

interface FormErrors {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  country?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

interface Props extends RouteComponentProps {}

export const SignUp: FC<Props> = props => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [country, setCountry] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value)
  }

  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value)
  }

  const handleChangePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }

  const handleChangeCountry = (event: ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value)
  }

  const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }

  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault()
    setLoading(true)
    const newUserData = {
      firstName,
      lastName,
      phoneNumber,
      country,
      username,
      email,
      password,
      confirmPassword,
    }

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData),
    })
      .then(response => {
        if (!response.ok) throw response
        return response.json()
      })
      .then(response => {
        localStorage.setItem('AuthToken', `Bearer ${response.token}`)
        setLoading(false)
        props.history.push('/')
      })
      .catch(error => {
        error.json().then((errorMsg: FormErrors) => {
          setErrors(errorMsg)
          setLoading(false)
        })
      })
  }

  return (
    <Card>
      <H1>{'Sign up'}</H1>

      <form>
        <FormGroup
          label={'First Name'}
          labelFor={'firstName'}
          intent={errors.firstName ? Intent.DANGER : Intent.NONE}
          helperText={errors.firstName}
        >
          <InputGroup
            id={'firstName'}
            name={'firstName'}
            value={firstName}
            required
            intent={errors.firstName ? Intent.DANGER : Intent.NONE}
            onChange={handleChangeFirstName}
          />
        </FormGroup>
        <FormGroup
          label={'Last Name'}
          labelFor={'lastName'}
          intent={errors.lastName ? Intent.DANGER : Intent.NONE}
          helperText={errors.lastName}
        >
          <InputGroup
            id={'lastName'}
            name={'lastName'}
            value={lastName}
            required
            intent={errors.lastName ? Intent.DANGER : Intent.NONE}
            onChange={handleChangeLastName}
          />
        </FormGroup>
        <FormGroup
          label={'User Name'}
          labelFor={'username'}
          intent={errors.username ? Intent.DANGER : Intent.NONE}
          helperText={errors.username}
        >
          <InputGroup
            id={'username'}
            name={'username'}
            value={username}
            required
            intent={errors.username ? Intent.DANGER : Intent.NONE}
            onChange={handleChangeUsername}
          />
        </FormGroup>
        <FormGroup
          label={'Phone'}
          labelFor={'phoneNumber'}
          intent={errors.phoneNumber ? Intent.DANGER : Intent.NONE}
          helperText={errors.phoneNumber}
        >
          <InputGroup
            id={'phoneNumber'}
            name={'phoneNumber'}
            value={phoneNumber}
            pattern={'[7-9]{1}[0-9]{9}'}
            required
            intent={errors.phoneNumber ? Intent.DANGER : Intent.NONE}
            onChange={handleChangePhoneNumber}
          />
        </FormGroup>
        <FormGroup
          label={'Email Address'}
          labelFor={'email'}
          intent={errors.email ? Intent.DANGER : Intent.NONE}
          helperText={errors.email}
        >
          <InputGroup
            id={'email'}
            name={'email'}
            value={email}
            autoComplete={'email'}
            required
            intent={errors.email ? Intent.DANGER : Intent.NONE}
            onChange={handleChangeEmail}
          />
        </FormGroup>
        <FormGroup
          label={'Country'}
          labelFor={'country'}
          intent={errors.country ? Intent.DANGER : Intent.NONE}
          helperText={errors.country}
        >
          <InputGroup
            id={'country'}
            name={'country'}
            value={country}
            required
            intent={errors.country ? Intent.DANGER : Intent.NONE}
            onChange={handleChangeCountry}
          />
        </FormGroup>
        <FormGroup
          label={'Password'}
          labelFor={'password'}
          intent={errors.password ? Intent.DANGER : Intent.NONE}
          helperText={errors.password}
        >
          <InputGroup
            id={'password'}
            name={'password'}
            value={password}
            required
            type={'password'}
            autoComplete={'current-password'}
            intent={errors.password ? Intent.DANGER : Intent.NONE}
            onChange={handleChangePassword}
          />
        </FormGroup>
        <FormGroup
          label={'Confirm Password'}
          labelFor={'confirmPassword'}
          intent={errors.confirmPassword ? Intent.DANGER : Intent.NONE}
          helperText={errors.confirmPassword}
        >
          <InputGroup
            id={'confirmPassword'}
            name={'confirmPassword'}
            value={confirmPassword}
            required
            type={'password'}
            autoComplete="current-password"
            intent={errors.confirmPassword ? Intent.DANGER : Intent.NONE}
            onChange={handleChangeConfirmPassword}
          />
        </FormGroup>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!(email && password && firstName && lastName && country && username && phoneNumber) || loading}
          loading={loading}
        >
          {'Sign Up'}
        </Button>{' '}
        {errors.general && <Text>{errors.general}</Text>}
      </form>
      <div>
        <a href={'/login'}>{'Already have an account? Sign in'}</a>
      </div>
    </Card>
  )
}
