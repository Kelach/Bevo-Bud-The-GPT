import { useEffect, useState } from 'react'
import {
  Title,
  Text, TextInput,
  Transition, Flex, AppShell,
  Burger, Group, Loader,
  Avatar, Stack, Divider,
  Paper, Button, ActionIcon,
  Tooltip
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useHover } from '@mantine/hooks';
import axios from "axios";
import { IconHistory, IconTrash } from '@tabler/icons-react';
import { useMantineTheme } from '@mantine/core';
import './App.css'
/**
 * @todo: 
 * - make redis database to cache previous queries (no login mumbo jumbo)
 */



interface ConversationProps {
  question: string;
  answer: string;
  id?: string;
  timestamp?: number;
}
interface MainPanelProps{
  setConversations: (conversations: ConversationProps[]) => void;
  setActiveConversation: (conversation: ConversationProps) => void;
  activeConversation: ConversationProps | undefined;
}
const presetQuestions = [
  {key: 0, text: "What are the best places to study on campus?"},
  {key: 1, text: "How do I get a parking permit?"},
  {key: 2, text: "Jester East or Jester West?"},
  {key: 3, text: "What are the best places to eat on campus?"},
]


const BASE_PATH_URL = "http://localhost:5000";
function MainPanel({ setConversations, setActiveConversation, activeConversation}: MainPanelProps){
  const [isLoading, { open: showLoading, close: hideLoading }] = useDisclosure(false);

  const form = useForm({
    mode: 'controlled',
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
    form.reset(); // clears search field

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
    }).catch((error) => {
      console.error(error)
      hideLoading();
    })
  }
const handlePresetQuestion = async (question: string) => {
  form.setValues({ search: question });
}
const convertTimestampToString = (timestamp: number) => {
  return new Date(timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
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
    <Flex p={"xl"} direction={"column"} top={0} left={0} my="auto" align={"center"} display={"flex"}>
      <Title mt={"10vh"} c={"orange"} order={1}>Bevo Bud The GPT</Title>
      <Text m={"xl"}> A fine-tuned LLM chatbot that helps answer all of your UT related questions</Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          name="Search"
          size='xl'
          radius={"xl"}
          maxLength={500}
          key={form.key('search')}
          placeholder='Ask a question...'
          {...form.getInputProps('search')}
        />
        <Group mt={"md"} grow>
          {presetQuestions.map((question: { key: number, text: string }) => {
            return (
              <Tooltip key={question.key} fz={"md"} color='orange' label={question.text} withArrow>
                <Button radius={"xl"} variant='light' onClick={() => handlePresetQuestion(question.text)}><Text truncate={true}>{question.text}</Text></Button>
              </Tooltip>
            )
          })}
        </Group>
      </form>
        {isLoading && <Loader mt={"xl"} size={"xl"} type="dots" color='orange' />}
      <Transition mounted={activeConversation != undefined && !isLoading} transition="fade">
        {(transitionStyle) => (
          <Paper p={"lg"} h={"100%"} w={"50vw"} radius={"xl"} shadow='md' style={{ ...transitionStyle }}>
            <Text style={{ "textTransform": 'capitalize', "textDecoration": 'underline', ...transitionStyle }} my={"xl"} fz={"1.5rem"} ta={"center"}>{activeConversation?.question}</Text>
            <Group wrap='nowrap' preventGrowOverflow={false} p="md" grow gap={"xl"} style={{ ...transitionStyle, width: "100%" }}>
              <Avatar maw={40} radius={"xl"} variant='light' c='orange' size="xl" src="https://img.cdn-pictorem.com/uploads/collection/S/SO5PKP9NEK/900_Row-One-Brand_1963-texas-cartoon-art-remix-tin-row-1.jpg" />
              <Text fz={"xl"} w={"100%"} style={{fontStyle: "italic"}} ta={"left"}>{activeConversation?.answer}</Text>
            </Group>
           {activeConversation?.timestamp && <Text style={{fontStyle: "italic"}} c={"dimmed"} ta={"right"}>{convertTimestampToString(activeConversation.timestamp)}</Text>}
          </Paper>
        )}
      </Transition>
    </Flex>
  )
}
export function App() {
  const [opened, { toggle }] = useDisclosure();
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  const [activeConversation, setActiveConversation] = useState<undefined | ConversationProps>(undefined);
  const {hovered, ref} = useHover();
  const theme = useMantineTheme();

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
  const handleClearConversations = async () => {
    const isConfirmed = confirm("Are you sure you want to clear all conversations?");

    if (!isConfirmed) return; // do nothing if user cancels

    const response = await axios.delete(`${BASE_PATH_URL}/conversations?all=true`);
    
    if (response.status === 200) {
      setConversations([]);
      setActiveConversation(undefined);
    }
  }
  return (
    <AppShell
      // header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1}>Bevo Bud</Title>
        </Group>
      </AppShell.Header> */}
      <AppShell.Navbar p="md">
        <Title ta={"center"}> <IconHistory aria-label='history' color='orange' size={40} /></Title>
        <Divider h={4} />
        <Stack mt={"md"} gap={"xs"} w={"100%"}>
        <Button ref={ref} style={{ transition: "all 200ms ease-in-out" }} color={hovered ? 'red' : "gray"} radius={"xl"} size='md' variant={hovered ? 'light' : 'transparent'} onClick={handleClearConversations}>Clear Conversations</Button>
          {conversations.map((conversation) => (
            <Group w={"100%"} grow key={conversation.id} preventGrowOverflow={false} wrap={"nowrap"}>
              <Button fullWidth={true}  radius={"md"} variant={activeConversation && conversation.id == activeConversation.id ? "light" : "subtle"} onClick={() => setActiveConversation(conversation)}>                
                <Text truncate={true}  fz={"md"} fw={"bold"} fs={"lg"}>{conversation.question}</Text>
              </Button>
              <ActionIcon variant='subtle' onClick={() => handleConvoDelete(conversation.id || "")}>
                <IconTrash color="red" size={20}/>
              </ActionIcon>
            </Group>
          ))}
        </Stack>

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
