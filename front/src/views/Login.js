import React from 'react';
import {
  Flex,
  HStack,
  VStack,
  Heading,
  Icon,
  Box,
  Button,
  Center,
  FormControl,
  Input,
  ScrollView,
  WarningOutlineIcon,
  Text,
  Spinner,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStateContext } from '../contexts/AppState';
import { users } from '../services/users';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  username: Yup.string().required('You must specify an username'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(64, 'Password must be less than 64 characters')
    .required('You must specify a password'),
});

export function Login({ navigation }) {
  const { setToken } = useAppStateContext();

  // Password box state and functions
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  // Loading indication
  const [loading, setLoading] = React.useState(false);
  // Error from backend
  const [backendError, setBackendError] = React.useState('');

  const submit = async ({ username, password }) => {
    setLoading(true);
    setBackendError('');

    try {
      const token = await users.login(username, password);
      setLoading(false);

      setToken(token);
      AsyncStorage.setItem('@token', token);
      navigation.navigate('Home');
    } catch (e) {
      setLoading(false);
      setBackendError(e.toString());
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        passwordVerify: '',
      }}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
        <Flex h="100%">
          <ScrollView>
            <Flex justify="space-between" align="center" pt={8}>
              <Box />
              <HStack space={12} alignItems="center">
                <Icon
                  as={MaterialCommunityIcons}
                  name="book"
                  color="coolGray.800"
                  size="2xl"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  fontWeight="semibold"
                />
                <Heading fontSize="4xl" color="primary.400">
                  My App
                </Heading>
              </HStack>
              <Center w="100%">
                <Box safeArea p="2" w="90%" maxW="290" py="8">
                  <VStack space={3} mt="5">
                    <FormControl isRequired isInvalid={touched.username && errors.username}>
                      <FormControl.Label>Username</FormControl.Label>
                      <Input
                        testID="username"
                        placeholder="clauzond"
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                      />
                      {touched.username && errors.username && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.username}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isRequired isInvalid={touched.password && errors.password}>
                      <FormControl.Label>Password</FormControl.Label>
                      <Box alignItems="center">
                        <Input
                          testID="password"
                          type={show ? 'text' : 'password'}
                          placeholder="Password"
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          InputRightElement={
                            <Button size="xs" rounded="none" w="1/6" h="full" onPress={handleClick}>
                              {show ? (
                                <Icon
                                  as={MaterialCommunityIcons}
                                  name="eye-off"
                                  color="white"
                                  size="sm"
                                />
                              ) : (
                                <Icon
                                  as={MaterialCommunityIcons}
                                  name="eye"
                                  color="white"
                                  size="sm"
                                />
                              )}
                            </Button>
                          }
                        />
                      </Box>
                      {touched.password && errors.password ? (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.password}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText
                          _text={{
                            fontSize: 'xs',
                          }}
                        >
                          Password must be at least 6 characters.
                        </FormControl.HelperText>
                      )}
                    </FormControl>
                    {loading && (
                      <HStack space={2} justifyContent="center">
                        <Spinner accessibilityLabel="Waiting for response" />
                        <Heading color="primary.500" fontSize="md">
                          Loading
                        </Heading>
                      </HStack>
                    )}
                    {backendError ? <Text color="error.600">{backendError}</Text> : null}
                  </VStack>
                </Box>
              </Center>
            </Flex>
          </ScrollView>
          <Flex pb={4} px={4} pt={1} direction="row" justify="space-between" mt={5}>
            <Button colorScheme="secondary" onPress={() => navigation.navigate('Welcome')}>
              Back
            </Button>
            <Button colorScheme="primary" onPress={handleSubmit}>
              Login
            </Button>
          </Flex>
        </Flex>
      )}
    </Formik>
  );
}
