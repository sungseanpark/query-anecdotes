import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, 
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      const message = `You created '${newAnecdote.content}'`
      dispatch({type: 'set', payload: message})
      setTimeout(() => {
        dispatch({type: 'clear'})
      }, 5000)
    },
    onError: () => {
      const message = `Anecdote too short, must have 5 characters or more`
      dispatch({type: 'set', payload: message})
      setTimeout(() => {
        dispatch({type: 'clear'})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0})
    // const message = `You created '${content}'`
    // dispatch({type: 'set', payload: message})
    // setTimeout(() => {
    //   dispatch({type: 'clear'})
    // }, 5000)
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
