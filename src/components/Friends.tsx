
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageCircle, Plus, Send, Search } from 'lucide-react';

const Friends = () => {
  const [friends] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '',
      status: 'Lost 5 lbs this month!',
      streak: 15,
      lastActive: '2 hours ago',
      caloriesGoal: 1800,
      exerciseToday: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: '',
      status: 'Completed 30-day fitness challenge',
      streak: 8,
      lastActive: '1 day ago',
      caloriesGoal: 2200,
      exerciseToday: false
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: '',
      status: 'New PR on bench press!',
      streak: 22,
      lastActive: '30 minutes ago',
      caloriesGoal: 1900,
      exerciseToday: true
    }
  ]);

  const [messages, setMessages] = useState({
    1: [
      { from: 'Sarah Johnson', message: 'Hey! How was your workout today?', time: '2:30 PM' },
      { from: 'You', message: 'It was great! Did a 5K run this morning.', time: '2:45 PM' },
      { from: 'Sarah Johnson', message: 'Awesome! I did yoga. We should plan a workout together soon!', time: '3:00 PM' }
    ],
    2: [
      { from: 'Mike Chen', message: 'Congrats on hitting your calorie goal yesterday!', time: '9:00 AM' },
      { from: 'You', message: 'Thanks! How is your challenge going?', time: '9:15 AM' }
    ],
    3: []
  });

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  const sendMessage = (friendId) => {
    if (newMessage.trim()) {
      setMessages(prev => ({
        ...prev,
        [friendId]: [
          ...prev[friendId],
          {
            from: 'You',
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
      setNewMessage('');
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Friends & Community</h2>
        <p className="text-muted-foreground">Stay motivated with your fitness buddies</p>
      </div>

      {/* Search and Add Friends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Find Friends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      <div className="grid gap-4">
        {filteredFriends.map((friend) => (
          <Card key={friend.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {getInitials(friend.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{friend.name}</h3>
                      {friend.exerciseToday && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active today
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{friend.status}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        🔥 {friend.streak} day streak
                      </span>
                      <span className="text-xs text-muted-foreground">
                        📍 {friend.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFriend(friend)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[600px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                              {getInitials(friend.name)}
                            </AvatarFallback>
                          </Avatar>
                          {friend.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Messages */}
                        <div className="max-h-60 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                          {messages[friend.id]?.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                  msg.from === 'You'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border'
                                }`}
                              >
                                <div>{msg.message}</div>
                                <div className={`text-xs mt-1 ${
                                  msg.from === 'You' ? 'text-blue-100' : 'text-muted-foreground'
                                }`}>
                                  {msg.time}
                                </div>
                              </div>
                            </div>
                          ))}
                          {messages[friend.id]?.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">
                              Start a conversation with {friend.name}!
                            </div>
                          )}
                        </div>
                        
                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="min-h-[60px]"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(friend.id);
                              }
                            }}
                          />
                          <Button
                            onClick={() => sendMessage(friend.id)}
                            size="sm"
                            className="h-[60px]"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Friend Stats */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{friend.caloriesGoal}</div>
                  <div className="text-xs text-muted-foreground">Daily Goal</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{friend.streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Community Challenge</h3>
            <p className="mb-4 opacity-90">Join this week's fitness challenge and compete with friends!</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm opacity-80">Participants</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4 days</div>
                <div className="text-sm opacity-80">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold">#12</div>
                <div className="text-sm opacity-80">Your Rank</div>
              </div>
            </div>
            <Button variant="secondary" className="mt-4">
              View Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Friends;
