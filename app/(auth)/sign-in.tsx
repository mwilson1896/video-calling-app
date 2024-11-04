import SignInWithOAuth from '@/components/SignInWithOAuth'
import StyledButton from '@/components/StyledButton'
import { useSignIn } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons'
import { Link, useRouter,  } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { View, Text, TextInput, Button, Alert, KeyboardAvoidingView, Platform } from 'react-native'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert(
        'Error signing in',
        'Please check your email and password and try again.'
      )
    }
  }, [isLoaded, emailAddress, password])

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ 
      flex: 1, 
      backgroundColor: "#5F5DEC",
      paddingHorizontal: 20,
      justifyContent: "center",
      gap: 20,
      }}>
        <MaterialIcons 
        name='video-chat'
        size={160}
        color="white"
        style={{
          alignSelf: "center",
          paddingBottom: 20,
        }}/>
      <TextInput
        autoCapitalize="none"
        style={{
          padding: 20,
          width: "100%",
          borderRadius: 10,
          backgroundColor: "white",
        }}
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress)=> setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        style={{
          padding: 20,
          width: "100%",
          borderRadius: 10,
          backgroundColor: "white",
        }}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password)=> setPassword(password)}
      />

      {/* Divider */}
      <View style={{
       borderBottomColor: "white",
       borderBottomWidth: 1,
       marginVertical: 10,
      }}/>

      <StyledButton title="Sign In" onPress={onSignInPress} />

      <Text
      style={{
          color: "white",
          textAlign: "center",
        }}>
        OR
      </Text>

      {/* Sign in with Auth */}
      <SignInWithOAuth/>

      {/* Divider */}
      <View style={{
       borderBottomColor: "white",
       borderBottomWidth: 1,
       marginVertical: 20,
      }}/>


      <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={{
          color: "white",
        }}>
          Don't have an account?
        </Text>
        <Link href="/sign-up">
          <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textDecorationLine: "underline",
          }}>
            Sign Up
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  )
}