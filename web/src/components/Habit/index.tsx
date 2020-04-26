import { Button, Card, FormGroup, H1, H2, InputGroup, Intent, Spinner } from '@blueprintjs/core'
import React, { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { authMiddleWare } from '../../util/auth'

interface FormError {
  title?: string
  body?: string
}

interface Habit {
  habitId: string
  title: string
  createdAt: string
  body: string
}

type Habits = Array<Habit>

interface Props extends RouteComponentProps {}

export const Habit: FC<Props> = props => {
  const [habits, setHabits] = useState<Habits>([])
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [habitId, setHabitId] = useState('')
  const [errors, setErrors] = useState<FormError>({})
  const [open, setOpen] = useState(false)
  const [uiLoading, setUiLoading] = useState(true)
  const [buttonType, setButtonType] = useState('')
  const [viewOpen, setViewOpen] = useState(false)

  useEffect(() => {
    authMiddleWare(props.history)

    const authToken = localStorage.getItem('AuthToken') || ''

    fetch('/habits', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => response.json())
      .then(response => {
        setHabits(response)
        setUiLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [props.history])

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleChangeBody = (event: ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value)
  }

  const deleteHabitHandler = (data: Habit) => {
    authMiddleWare(props.history)

    const authToken = localStorage.getItem('AuthToken') || ''

    let habitId = data.habitId

    fetch(`habit/${habitId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authToken,
      },
    })
      .then(() => {
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleEditClickOpen = (data: Habit) => {
    setTitle(data.title)
    setBody(data.body)
    setHabitId(data.habitId)
    setButtonType('Edit')
    setOpen(true)
  }

  const handleViewOpen = (data: Habit) => {
    setTitle(data.title)
    setBody(data.body)
    setViewOpen(true)
  }

  const handleClickOpen = () => {
    setHabitId('')
    setTitle('')
    setBody('')
    setButtonType('')
    setOpen(true)
  }

  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault()

    authMiddleWare(props.history)

    const userHabit = { title, body }

    const authToken = localStorage.getItem('AuthToken') || ''

    fetch(buttonType === 'Edit' ? `/habit/${habitId}` : '/habit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify(userHabit),
    })
      .then(response => response.json())
      .then(() => {
        setOpen(false)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
        setOpen(true)
        setErrors(error.response.data)
      })
  }

  const handleViewClose = () => {
    setViewOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return uiLoading ? (
    <Spinner size={150} />
  ) : (
    <main>
      <Button type={'submit'} onClick={handleClickOpen}>
        {'Add Habit'}
      </Button>

      {open && (
        <div>
          <div>
            <H1>{buttonType === 'Edit' ? 'Edit Habit' : 'Create a new Habit'}</H1>
          </div>

          <form>
            <FormGroup
              helperText={errors.title}
              intent={errors.title ? Intent.WARNING : Intent.NONE}
              label={'Habit Title'}
              labelFor={'email'}
            >
              <InputGroup
                id={'habitTitle'}
                name={'title'}
                intent={errors.title ? Intent.WARNING : Intent.NONE}
                required
                value={title}
                onChange={handleChangeTitle}
              />
            </FormGroup>

            <FormGroup
              helperText={errors.body}
              intent={errors.body ? Intent.WARNING : Intent.NONE}
              label={'Habit Details'}
              labelFor={'body'}
            >
              <InputGroup
                id={'habitDetails'}
                name={'body'}
                intent={errors.body ? Intent.WARNING : Intent.NONE}
                required
                value={body}
                onChange={handleChangeBody}
              />
            </FormGroup>
          </form>

          <Button onClick={handleClose}>{'Cancel'}</Button>
          <Button onClick={handleSubmit}>{buttonType === 'Edit' ? 'Save' : 'Submit'}</Button>
        </div>
      )}

      {habits.map(habit => (
        <Card key={habit.habitId}>
          <p>{habit.title}</p>
          <p>{habit.createdAt}</p>
          <p>{habit.body}</p>
          <Button onClick={() => handleViewOpen(habit)}>{'View'}</Button>
          <Button onClick={() => handleEditClickOpen(habit)}>{'Edit'}</Button>
          <Button onClick={() => deleteHabitHandler(habit)}>{'Delete'}</Button>
        </Card>
      ))}

      {viewOpen && (
        <div>
          <Button onClick={handleViewClose}>{'Close'}</Button>
          <H2>{title}</H2>
          <p>{body}</p>
        </div>
      )}
    </main>
  )
}
