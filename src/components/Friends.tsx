
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageCircle, Plus, Send, Search, UserPlus, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface Friend {
  friendship_id: string;
  friend_id: string;
  friend_name: string;
  friend_email: string;
  friend_age?: number;
  status: string;
  is_requester: boolean;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  age?: number;
}

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const { toast } = useToast();

  // Fetch friends
  const { data: friends = [], refetch: refetchFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_friends')
        .select('*')
        .eq('status', 'accepted');
      
      if (error) throw error;
      return data as Friend[];
    }
  });

  // Fetch pending friend requests
  const { data: pendingRequests = [], refetch: refetchPending } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_friends')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data as Friend[];
    }
  });

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, age')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .neq('id', currentUser.user?.id)
        .limit(10);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      // Transform the data to match our User interface
      const users: User[] = (data || []).map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name || profile.email,
        email: profile.email,
        age: profile.age
      }));

      setSearchResults(users);
    } catch (error) {
      console.error('Search users error:', error);
      toast({
        title: 'Error',
        description: 'Failed to search users',
        variant: 'destructive'
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: (await supabase.auth.getUser()).data.user?.id,
          addressee_id: userId
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Friend request sent!'
      });
      
      refetchPending();
      setSearchResults([]);
      setSearchTerm('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send friend request',
        variant: 'destructive'
      });
    }
  };

  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: accept ? 'Friend request accepted!' : 'Friend request rejected'
      });

      refetchFriends();
      refetchPending();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to respond to friend request',
        variant: 'destructive'
      });
    }
  };

  const sendMessage = async () => {
    if (!messageContent.trim() || !selectedFriend) return;

    try {
      // For now, we'll just show a toast. In a real app, you'd store messages in a database
      toast({
        title: 'Message Sent',
        description: `Message sent to ${selectedFriend.friend_name}!`
      });
      
      setMessageContent('');
      setMessageDialogOpen(false);
      setSelectedFriend(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const isAlreadyFriend = (userId: string) => {
    return friends.some(friend => friend.friend_id === userId) ||
           pendingRequests.some(request => request.friend_id === userId);
  };

  const formatUserDisplay = (user: User) => {
    const age = user.age ? `, ${user.age}` : '';
    return `${user.full_name || user.email}${age}`;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Friends & Community</h2>
        <p className="text-gray-300">Connect with other fitness enthusiasts</p>
      </div>

      {/* Search and Add Friends */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Find Friends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Search Results:</h4>
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {getInitials(user.full_name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{formatUserDisplay(user)}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={isAlreadyFriend(user.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {isAlreadyFriend(user.id) ? 'Sent' : 'Add'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Pending Friend Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.friendship_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials(request.friend_name || request.friend_email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">
                        {request.friend_name || request.friend_email}
                        {request.friend_age && `, ${request.friend_age}`}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {request.is_requester ? 'Request sent' : 'Wants to be friends'}
                      </p>
                    </div>
                  </div>
                  {!request.is_requester && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => respondToFriendRequest(request.friendship_id, true)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => respondToFriendRequest(request.friendship_id, false)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Your Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-400">No friends yet. Search for people to add as friends!</p>
            </CardContent>
          </Card>
        ) : (
          friends.map((friend) => (
            <Card key={friend.friendship_id} className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {getInitials(friend.friend_name || friend.friend_email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {friend.friend_name || friend.friend_email}
                          {friend.friend_age && `, ${friend.friend_age}`}
                        </h3>
                        <Badge variant="secondary" className="bg-green-900 text-green-300">
                          Friends
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{friend.friend_email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    onClick={() => {
                      setSelectedFriend(friend);
                      setMessageDialogOpen(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Send Message to {selectedFriend?.friend_name || selectedFriend?.friend_email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setMessageDialogOpen(false);
                  setMessageContent('');
                  setSelectedFriend(null);
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!messageContent.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-1" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Friends;
