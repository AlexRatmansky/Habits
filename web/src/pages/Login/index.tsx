import React, { ChangeEvent, FC, MouseEvent, useState } from 'react'
import { Button, Card, FormGroup, H1, InputGroup, Intent, Text } from '@blueprintjs/core'

import { RouteComponentProps } from 'react-router'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

interface Props extends RouteComponentProps {}

export const Login: FC<Props> = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault()
    setLoading(true)
    const userData = { email, password }

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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
      <H1>{'Login'}</H1>
      <form>
        <FormGroup
          helperText={errors.email}
          intent={errors.email ? Intent.WARNING : Intent.NONE}
          label={'Email Address'}
          labelFor={'email'}
        >
          <InputGroup
            id={'email'}
            name={'email'}
            intent={errors.email ? Intent.WARNING : Intent.NONE}
            required
            onChange={handleChangeEmail}
            autoFocus
          />
        </FormGroup>
        <FormGroup
          helperText={errors.password}
          intent={errors.password ? Intent.DANGER : Intent.NONE}
          label={'Password'}
          labelFor={'password'}
        >
          <InputGroup
            id={'password'}
            name={'password'}
            type={'password'}
            intent={errors.password ? Intent.DANGER : Intent.NONE}
            required
            onChange={handleChangePassword}
          />
        </FormGroup>
        <Button type="submit" onClick={handleSubmit} disabled={!(email && password) || loading} loading={loading}>
          {'Sign In'}
        </Button>{' '}
        {errors.general && <Text>{errors.general}</Text>}
      </form>
      <div>
        <a href={'signup'}>{"Don't have an account? Sign Up"}</a>
      </div>
    </Card>
  )
}
