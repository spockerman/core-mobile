import React, { useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth'
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useNavigation } from '@react-navigation/native';

import { Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButtonButton,
  CreateAccountButtonText
} from './styles';
import logoImg from '../../assets/logo.png';

interface SignInFormData{
  email:string;
  password:string;
}


const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
    formRef.current?.setErrors({});
    const schema = Yup.object().shape({
      email: Yup.string().required('Digite seu E-mail'),
      password: Yup.string().required('Digite sua senha'),
    });
    await schema.validate(data, {
      abortEarly: false,
    });

    await signIn({
      email: data.email,
      password: data.password,
    });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      } else {
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login.',
        )
      }
    }
  }, []);

  return (
  <>
    <KeyboardAvoidingView
    style={{ flex:1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex:1}}>
        <Container>
          <Image source={logoImg}/>
          <View>
            <Title>Faça o seu Logon</Title>
          </View>
          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={()=>{
                passwordInputRef.current?.focus();
              }}
             />
            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Password"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={()=>{formRef.current?.submitForm();}}
            />
            <Button onPress={()=>{formRef.current?.submitForm();}}>Entrar</Button>
          </Form>
          <ForgotPassword onPress={()=>{console.log('Ok')}}>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
        </ScrollView>
    </KeyboardAvoidingView>
    {/* <CreateAccountButtonButton onPress={()=> navigation.navigate('SignUp')}>
      <Icon name="log-in" size={20} color="#00EBC1"/>
      <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
    </CreateAccountButtonButton> */}
  </>
  );
}

export default SignIn;
