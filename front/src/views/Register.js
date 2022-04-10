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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppStateContext } from '../contexts/AppState';
import { users } from '../services/users';

const validationSchema = Yup.object({
  username: Yup.string().required('You must specify an username'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(64, 'Password must be less than 64 characters')
    .required('You must specify a password'),
  passwordVerify: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export function Register({ navigation }) {
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
      const token = await users.register(username, password);
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
                  Mon App
                </Heading>
              </HStack>
              <Center w="100%">
                <Box safeArea p="2" w="90%" maxW="290" py="8">
                  <VStack space={3} mt="5">
                    <FormControl isRequired isInvalid={touched.username && errors.username}>
                      <FormControl.Label>Identifiant</FormControl.Label>
                      <Input
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
                      <FormControl.Label>Mot de passe</FormControl.Label>
                      <Box alignItems="center">
                        <Input
                          type={show ? 'text' : 'password'}
                          placeholder="Mot de passe"
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
                          Le mot de passe doit faire au moins 6 charactères.
                        </FormControl.HelperText>
                      )}
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={touched.passwordVerify && errors.passwordVerify}
                    >
                      <FormControl.Label>Confirmer le mot de passe</FormControl.Label>
                      <Input
                        type="password"
                        placeholder="Mot de passe"
                        onChangeText={handleChange('passwordVerify')}
                        onBlur={handleBlur('passwordVerify')}
                        value={values.passwordVerify}
                      />
                      {touched.passwordVerify && errors.passwordVerify && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.passwordVerify}
                        </FormControl.ErrorMessage>
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
              Retour
            </Button>
            <Button colorScheme="primary" onPress={handleSubmit}>
              S'inscrire
            </Button>
          </Flex>
        </Flex>
      )}
    </Formik>
  );
}
