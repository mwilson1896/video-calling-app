import * as React from 'react'
import { Alert, Text } from 'react-native'
import { TextInput, Button, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import StyledButton from '@/components/StyledButton'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error", err.errors[0].message)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      )
    }
  }

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
      {!pendingVerification && (
        <View
        style={{
          gap:10,
        }}>
          <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 20,
          }}>
            {"Enter your email and password to sign up"}
          </Text>
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
            onChangeText={(email) => setEmailAddress(email)}
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
            onChangeText={(password) => setPassword(password)}
          />
          <StyledButton title="Sign Up" onPress={onSignUpPress} />
        </View>
      )}
      {pendingVerification && (
        <>
          <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 20,
          }}>
            "Enter the verification code we sent to your email"
          </Text>
          <TextInput value={code}
          style={{
            padding: 20,
            width: "100%",
            borderRadius: 10,
            backgroundColor: "white",
            marginBottom: 10,
          }}
          placeholder="Code..." 
          onChangeText={(code) => setCode(code)} />
          <StyledButton title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </KeyboardAvoidingView>
  )
}