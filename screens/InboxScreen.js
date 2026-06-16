import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import { authHeaders } from '../auth';

export default function InboxScreen({ route, navigation }) {
  const { username } = route.params || { username: null };
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([]);
  const [readMessages, setReadMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const response = await fetch(`${API_BASE_URL}/api/messages`, { headers });
      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages || []);
      const readIds = (data.messages || []).filter((msg) => msg.read).map((m) => m._id);
      setReadMessages(readIds);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Couldn’t reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = () => {
    setLoading(true);
    fetchMessages();
  };

  // Refetch when the screen regains focus, and poll while focused so new letters
  // show up without having to log out and back in.
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 12000);
      return () => clearInterval(intervalId);
    }, [fetchMessages])
  );

  // Persist read status to the server (optimistically update locally first) so it
  // survives leaving and re-entering the inbox.
  const markRead = async (msgId) => {
    setReadMessages((prev) => (prev.includes(msgId) ? prev : [...prev, msgId]));
    try {
      const headers = await authHeaders();
      await fetch(`${API_BASE_URL}/api/messages/${msgId}/read`, { method: 'PATCH', headers });
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
    <View style={[styles.messageContainer, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.fullMessageText}>{currentMessage}</Text>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}


  const topPad = insets.top + 10;

  // Initial load — spinner instead of a blank screen.
  if (loading && messages.length === 0) {
    return (
      <View style={[styles.stateContainer, { paddingTop: topPad }]}>
        <ActivityIndicator size="large" color="#b73430" />
        <Text style={styles.stateSubtitle}>Loading your letters…</Text>
      </View>
    );
  }

  // Error with nothing cached to show — friendly message + retry.
  if (error && messages.length === 0) {
    return (
      <View style={[styles.stateContainer, { paddingTop: topPad }]}>
        <Text style={styles.stateTitle}>Couldn’t load your letters</Text>
        <Text style={styles.stateSubtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty inbox.
  if (messages.length === 0) {
    return (
      <View style={[styles.stateContainer, { paddingTop: topPad }]}>
        <Text style={styles.stateTitle}>No letters yet</Text>
        <Text style={styles.stateSubtitle}>
          Share your link and the anonymous letters you receive will appear here.
        </Text>
      </View>
    );
  }

  return (
  <ScrollView
    style={styles.gridScroll}
    contentContainerStyle={[styles.gridContainer, { paddingTop: topPad }]}
  >
    {messages.map((msg) => {
        //console.log('Message object:', msg);
      const isRead = readMessages.includes(msg._id);

      return (
        <TouchableOpacity
          key={msg._id}
          style={styles.iconButton}
          onPress={() => {
  markRead(msg._id);
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
  gridScroll: {
  backgroundColor: '#e9dec8',
},
  gridContainer: {
  flexGrow: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'flex-start',
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

stateContainer: {
  flex: 1,
  backgroundColor: '#e9dec8',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 40,
},
stateTitle: {
  fontSize: 20,
  fontFamily: 'Glacial-Regular',
  color: '#302f2e',
  marginBottom: 10,
  textAlign: 'center',
},
stateSubtitle: {
  fontSize: 15,
  fontFamily: 'Glacial-Regular',
  color: '#6b655c',
  textAlign: 'center',
  marginTop: 10,
  lineHeight: 22,
},
retryButton: {
  marginTop: 24,
  backgroundColor: '#b73430',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 12,
},
retryText: {
  color: '#fff',
  fontFamily: 'Glacial-Regular',
  fontSize: 15,
},

});

