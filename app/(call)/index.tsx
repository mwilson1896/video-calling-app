import { SignedIn, useAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Dialog from "react-native-dialog";

export default function IndexScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { signOut } = useAuth();
  
  return (
    <View>
      <TouchableOpacity
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 100,
      }}
      onPress={() => setDialogOpen(true)}
      >
        <MaterialCommunityIcons name="exit-run" size={24} color="5F5DEC" />
      </TouchableOpacity>

      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Sign Out</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to leave?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button 
          label="Sign Out" 
          onPress={async() => {
            await signOut();
            setDialogOpen(false);
          }} 
        />
      </Dialog.Container>

      <Text>Hello World</Text>

      <SignedIn>
        <Text>Signed In</Text>
      </SignedIn>
    </View>
  );
}
