import { useEffect, useState } from 'react'
import { Title, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import './App.css'

interface ConversationProps{

}


function App() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      search: '',
    },

    validate: {
      search: (value) => (value.trim().length <= 500 ? null : 'Invalid email'),
    },
  });
  const onSubmitHandler = (values: FormData) => {
    // make request to backend to generate response
  }
  const [query, setQuery] = useState('');
  const [currentRoom, setCurrentRoom] = useState<string>('');

  useEffect(() => {
    // make request to backend to get messages for most recent room and all current rooms
    // make request to set currentRoom
  })

  useEffect(() => {
    // make request to set messages
  }, [currentRoom])

  const changeRooms = (room: string) => {
    setCurrentRoom(room);
  }
  return (
    <>
      <Title order={1}>Bevo Bud The GPT</Title>
      <Text>Bevo Bud The GPT is a GPT-3 powered chatbot that can help you with your queries.</Text>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput 
        label='Search' 
        value={query} 
        name="Search"
        key={form.key('search')}
        placeholder='Ask a question'
        onChange={(event) => setQuery(event.currentTarget.value)}/>
      </form>
    </>
  )
}

export default App
