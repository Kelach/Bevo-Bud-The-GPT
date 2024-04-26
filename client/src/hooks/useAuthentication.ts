import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
// import useLoc
export interface useAuthenticationUserProp {
  email: string,
  userName: string

}
export interface AuthenicationProp {
  setToken?: (val: string) => void
  removeToken?: () => void,
  isAuth?: boolean,
  user?: useAuthenticationUserProp,
}

 export const useAuthentication = (): AuthenicationProp => {
  // function returns authentication state  (boolean, and user)
  // and user after fetching user from the token
  // stored in local storga
  const [tokenValue, setToken, removeToken] = useLocalStorage({
    key: 'user_name',
    defaultValue: ''
  });
  
   const [sessionState, setSessionState] = useState<AuthenicationProp>({
     isAuth: undefined,
     user: undefined,
     setToken: undefined,
     removeToken: undefined
   });

  useEffect(() => {
    const fetchUser = async () => {
      
      if (!tokenValue) {
        setSessionState({
          isAuth: false,
          user: undefined,
          setToken: setToken,
          removeToken: removeToken
        })
        return // returns if token is undefined
      }
      const { data, success, statusCode, error } = await apiClient.fetchUserFromToken();
      if (success) {
        // update props if authentication was successful
        console.log("renaming user_type to userType");
        setSessionState(() => ({
          isAuth: true,
          user : data.user,
          setToken: setToken,
          removeToken: removeToken,
        }))
      } else if (statusCode === 401) {
        console.log("unauthenticated user found")
      } else{
        console.log("unexpected error has occured.\n","code: ", statusCode);
        console.log("error: ", error,);
      }
    }
    fetchUser();

  }, [tokenValue]);
  console.log("returning session state: ", sessionState)

  return sessionState
};