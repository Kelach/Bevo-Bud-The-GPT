import { useEffect, useState } from 'react'
import {
  Title,
  Text, TextInput,
  Transition, Flex, AppShell,
  Burger, Group, Skeleton, Loader,
  Avatar, Image, Stack,
  Divider,
  Paper,
  Button,
  ActionIcon
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from '@mantine/hooks';
import axios from "axios";
import { IconTrash } from '@tabler/icons-react';
// import './App.css'
/**
 * @todo: 
 * - make redis database to cache previous queries (no login mumbo jumbo)
 */



interface ConversationProps {
  question: string;
  answer: string;
  id?: string;
  timestamp?: Date;
}
interface MainPanelProps{
  setConversations: (conversations: ConversationProps[]) => void;
  setActiveConversation: (conversation: ConversationProps) => void;
  activeConversation: ConversationProps | undefined;
}

const BASE_PATH_URL = "http://localhost:5000";
function MainPanel({ setConversations, setActiveConversation, activeConversation}: MainPanelProps){
  const [isLoading, { open: showLoading, close: hideLoading }] = useDisclosure(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      search: '',
    },

    validate: {
      search: (value) => (value.trim().length <= 500 ? null : 'Your question is too long. Please shorten it.'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const { search } = values;
    showLoading();
    form.reset(); // clear form
    
    axios({
      method: 'post',
      url: `${BASE_PATH_URL}/question`,
      data: {question: search}
    }).then((response) => {
      // make request to backend to generate response
      const { generated_text } = response.data[0];
      setActiveConversation({ 
        question: search, 
        answer: generated_text, 
      });
      hideLoading();
      // setResponse(response.data);
    }).catch((error) => {
      console.error(error)
      form.setFieldValue('search', search);
      hideLoading();
    })
  }
  useEffect(() => {
    // fetches conversations everytime a new response is generated
    const fetchConversations = async () => {
      const response = await axios.get(`${BASE_PATH_URL}/conversations?all=true`);
      // sets conversations from history if there are any
      if (response.data.conversations.length > 0) setConversations(response.data.conversations.reverse());
    }
    fetchConversations();
  }, [activeConversation])


  return (
    <Flex p={"xl"} direction={"column"} align={"center"} display={"flex"} >
      <Title order={1}>Bevo Bud The GPT</Title>
      <Text>Bevo Bud The GPT is a GPT-3 powered chatbot that can help you with your queries.</Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          name="Search"
          size='xl'
          radius={"xl"}
          key={form.key('search')}
          placeholder='Ask a question'
          {...form.getInputProps('search')}
        />
      </form>
      <Group justify='flex-start'>
        <Avatar radius={"50%"} variant='outline' color='orange' size="xl" src="https://img.cdn-pictorem.com/uploads/collection/S/SO5PKP9NEK/900_Row-One-Brand_1963-texas-cartoon-art-remix-tin-row-1.jpg"/>
        {isLoading && <Loader type="dots" color='orange' />}
        <Transition mounted={activeConversation != undefined && !isLoading} transition="fade" duration={500}>
          {(transitionStyle) => (
            <Paper>
              <Text maw={"80%"} style={{ ...transitionStyle }}>
                {activeConversation?.question}
              </Text>
              <Divider h={"xl"} />
              <Text maw={"80%"} style={{ ...transitionStyle }}>
                {activeConversation?.answer}
              </Text>
            </Paper>
          )}
        </Transition>
      </Group>
    </Flex>
  )
}
export function App() {
  const [opened, { toggle }] = useDisclosure();
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  const [activeConversation, setActiveConversation] = useState<undefined | ConversationProps>(undefined);

  const handleConvoDelete = async (id : string) => {
    if (id !== "") {
      const response = await axios.delete(`${BASE_PATH_URL}/conversations?id=${id}`);
      if (response.status === 200) {
        // remove conversation from list
        const newConversations = conversations.filter((conversation) => conversation.id !== id);
        setConversations(newConversations);
        // remove active conversation if it is the one being deleted
        if (activeConversation && activeConversation.id === id) setActiveConversation(undefined);
      }
    }
  }
  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1}>Bevo Bud</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Title ta={"center"}>Conversations</Title>
        {conversations.map((conversation) => (
          <Group grow key={conversation.id}>
          <Button radius={"md"} variant={activeConversation && conversation.id == activeConversation.id  ? "light" : "subtle" } onClick={() => setActiveConversation(conversation)}>
              <Text fw={"bolder"} fs={"lg"} truncate={true}>{conversation.question}</Text>
              <Divider h={"xs"} />
              {conversation.timestamp && <Text c='dimmed'>{conversation.timestamp.toLocaleDateString()}</Text>}
          </Button>
          <ActionIcon variant='outline' size={"md"} onClick={() => handleConvoDelete(conversation.id || "")}>
            {/* <IconTrash size={"md"} /> */}
          </ActionIcon>
          </Group>
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <MainPanel 
        setConversations={setConversations}
        setActiveConversation={setActiveConversation} 
        activeConversation={activeConversation}
         />
      </AppShell.Main>
    </AppShell>
  );
}

export default App
