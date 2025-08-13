import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  Search,
  Paperclip,
  MoreVertical,
  Circle,
  CheckCircle2,
  Clock,
  User,
  Building
} from "lucide-react";

export default function Messages() {
  const { t } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages", { userId: user?.id }],
    select: (data) => data || [],
  });

  // Group messages by conversation (sender/recipient pairs)
  const conversations = messages.reduce((acc: any, message: any) => {
    const conversationId = message.senderId === user?.id 
      ? message.recipientId 
      : message.senderId;
    
    if (!acc[conversationId]) {
      acc[conversationId] = {
        id: conversationId,
        participants: [message.senderId, message.recipientId],
        lastMessage: message,
        messages: [],
        unreadCount: 0
      };
    }
    
    acc[conversationId].messages.push(message);
    
    // Update last message if this one is newer
    if (new Date(message.createdAt) > new Date(acc[conversationId].lastMessage.createdAt)) {
      acc[conversationId].lastMessage = message;
    }
    
    // Count unread messages
    if (message.recipientId === user?.id && message.status !== 'read') {
      acc[conversationId].unreadCount++;
    }
    
    return acc;
  }, {});

  const conversationList = Object.values(conversations).sort((a: any, b: any) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { recipientId: string; content: string; subject?: string }) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return apiRequest("PUT", `/api/messages/${messageId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      recipientId: selectedConversation,
      content: newMessage,
    });
  };

  const getMessageStatus = (message: any) => {
    if (message.senderId !== user?.id) return null;
    
    switch (message.status) {
      case 'sent':
        return <Circle className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const selectedConversationData = selectedConversation 
    ? conversations[selectedConversation] 
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
              <div className="bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
          <p className="text-lg text-gray-600">
            Communicate with vendors and buyers in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
              {conversationList.length > 0 ? (
                <div className="space-y-1">
                  {conversationList.map((conversation: any) => {
                    const otherParticipant = conversation.participants.find((p: string) => p !== user?.id);
                    const isSelected = selectedConversation === otherParticipant;
                    
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(otherParticipant);
                          // Mark messages as read
                          conversation.messages
                            .filter((msg: any) => msg.recipientId === user?.id && msg.status !== 'read')
                            .forEach((msg: any) => markAsReadMutation.mutate(msg.id));
                        }}
                        className={`p-4 cursor-pointer border-l-4 transition-colors ${
                          isSelected 
                            ? "bg-primary/5 border-primary" 
                            : "border-transparent hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {otherParticipant === user?.id ? "You" : `User ${otherParticipant}`}
                              </p>
                              <div className="flex items-center space-x-2">
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                            
                            {(conversation.lastMessage.orderId || conversation.lastMessage.rfqId) && (
                              <div className="flex items-center mt-1">
                                <Building className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">
                                  {conversation.lastMessage.orderId ? "Order" : "RFQ"} related
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No conversations yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            {selectedConversationData ? (
              <Card className="flex flex-col h-full">
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {selectedConversation === user?.id ? "You" : `User ${selectedConversation}`}
                        </h3>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversationData.messages
                    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((message: any) => {
                      const isMyMessage = message.senderId === user?.id;
                      
                      return (
                        <div key={message.id} className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isMyMessage 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-gray-100 text-gray-900"
                          }`}>
                            {message.subject && (
                              <p className="font-semibold text-sm mb-1">{message.subject}</p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            
                            <div className={`flex items-center justify-between mt-1 ${
                              isMyMessage ? "text-primary-foreground/70" : "text-gray-500"
                            }`}>
                              <span className="text-xs">
                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {getMessageStatus(message)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[44px] max-h-32 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
