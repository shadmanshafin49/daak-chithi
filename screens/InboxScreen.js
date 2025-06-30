import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function InboxScreen({ route, navigation }) {
  const { username } = route.params || { username: null };

  const [messages, setMessages] = useState([]);
  const [readMessages, setReadMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
  if (!username) return;

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://192.168.0.106:5000/api/messages/${username}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      //console.log('Fetched messages:', data.messages);
      setMessages(data.messages || []);
      const readIds = (data.messages || []).filter((msg) => msg.read).map((m) => m._id);
      setReadMessages(readIds);
    } catch (error) {
      console.error(error);
    }
  };

    fetchMessages();
  }, [username]);

  const onMessagePress = async (msg) => {
  try {
    await fetch(`http://192.168.0.106:5000/api/messages/${msg._id}/read`, {
      method: 'PATCH',
    });

    setReadMessages((prev) => [...prev, msg._id]);
    setCurrentMessage(msg.text);
    setShowMessage(true);
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};


  const handleBackToList = () => {
    setShowMessage(false);
    setCurrentMessage('');
  };

  if (showMessage) {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.fullMessageText}>{currentMessage}</Text>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}


  return (
  <ScrollView contentContainerStyle={styles.gridContainer}>
    {messages.map((msg) => {
        //console.log('Message object:', msg);
      const isRead = readMessages.includes(msg._id);

      return (
        <TouchableOpacity
          key={msg._id}
          style={styles.iconButton}
          onPress={() => {
  //console.log('Opening message:', msg.text);
  setReadMessages((prev) => [...prev, msg._id]);
navigation.navigate('LetterView', { message: msg.message || msg.text || '' });
}}


        >
          <Image
            source={
              isRead
                ? require('../assets/read.png')
                : require('../assets/unread.png')
            }
            style={styles.iconImage}
          />
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#e9dec8',
    minHeight: '100%',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f6f4f1',
    borderRadius: 8,
    width: '100%',
  },
  unreadIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  previewText: {
    fontSize: 16,
    color: '#302f2e',
    flexShrink: 1,
  },
  noMessagesText: {
    fontSize: 18,
    color: '#555',
    marginTop: 50,
  },
  messageContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f4f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMessageText: {
    fontSize: 20,
    color: '#302f2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e9dec8',
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#b73430',
  },
  gridContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: 10,
  gap: 15, // Optional if using React Native 0.71+
},

iconButton: {
  width: 70,
  height: 70,
  margin: 10,
},

iconImage: {
  width: 70,
  height: 70,
  resizeMode: 'contain',
},

});

