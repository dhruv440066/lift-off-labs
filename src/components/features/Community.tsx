import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Plus,
  Pin,
  Lightbulb,
  Recycle,
  Leaf,
  Zap,
  BookOpen
} from 'lucide-react';
import { useCommunityPosts, useCommunityEvents, usePostComments, useCommunityMutations, useLeaderboard } from '@/hooks/useCommunity';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const categoryIcons = {
  general: BookOpen,
  recycling: Recycle,
  composting: Leaf,
  energy_saving: Zap,
  events: Calendar,
  tips: Lightbulb
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-800',
  recycling: 'bg-green-100 text-green-800',
  composting: 'bg-brown-100 text-brown-800',
  energy_saving: 'bg-yellow-100 text-yellow-800',
  events: 'bg-purple-100 text-purple-800',
  tips: 'bg-orange-100 text-orange-800'
};

export const Community: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const { posts, isLoading: postsLoading } = useCommunityPosts(activeCategory);
  const { events, isLoading: eventsLoading } = useCommunityEvents();
  const { leaderboard } = useLeaderboard();
  const { profile } = useProfile();
  const { createPost, createComment, toggleLike, createEvent, joinEvent } = useCommunityMutations();

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'discussion',
    category: 'general'
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_participants: '',
    event_type: 'cleanup',
    points_reward: 50
  });

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createPost.mutateAsync(newPost);
      setNewPost({ title: '', content: '', post_type: 'discussion', category: 'general' });
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.description.trim() || !newEvent.event_date || !newEvent.location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createEvent.mutateAsync({
        ...newEvent,
        max_participants: newEvent.max_participants ? parseInt(newEvent.max_participants) : undefined
      });
      setNewEvent({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_participants: '',
        event_type: 'cleanup',
        points_reward: 50
      });
      setShowCreateEvent(false);
      toast.success('Event created successfully!');
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await toggleLike.mutateAsync({ postId });
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await joinEvent.mutateAsync(eventId);
      toast.success('Successfully joined the event!');
    } catch (error) {
      toast.error('Failed to join event');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fadeInScale">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-primary" />
            Community Hub
          </h2>
          <p className="text-muted-foreground mt-2">
            Connect with eco-warriors, share tips, and join community events
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                />
                <Select value={newPost.post_type} onValueChange={(value) => setNewPost({ ...newPost, post_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discussion">Discussion</SelectItem>
                    <SelectItem value="tip">Tip</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="recycling">Recycling</SelectItem>
                    <SelectItem value="composting">Composting</SelectItem>
                    <SelectItem value="energy_saving">Energy Saving</SelectItem>
                    <SelectItem value="tips">Tips</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreatePost} className="w-full" disabled={createPost.isPending}>
                  {createPost.isPending ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Community Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <Textarea
                  placeholder="Event description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                />
                <Input
                  type="datetime-local"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                />
                <Input
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max participants (optional)"
                  value={newEvent.max_participants}
                  onChange={(e) => setNewEvent({ ...newEvent, max_participants: e.target.value })}
                />
                <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanup">Community Cleanup</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="awareness">Awareness Campaign</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateEvent} className="w-full" disabled={createEvent.isPending}>
                  {createEvent.isPending ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Community Posts</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All
            </Button>
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading posts...</p>
              </div>
            ) : posts?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No posts yet. Be the first to start a conversation!</p>
                </CardContent>
              </Card>
            ) : (
              posts?.map((post) => {
                const CategoryIcon = categoryIcons[post.category as keyof typeof categoryIcons];
                return (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {getInitials(post.profiles?.full_name || 'User')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{post.profiles?.full_name || 'Anonymous'}</h4>
                            <Badge variant="outline" className="text-xs">
                              {post.profiles?.level || 'Eco Starter'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(post.created_at)}
                            </span>
                            {post.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={categoryColors[post.category as keyof typeof categoryColors]}>
                              <CategoryIcon className="w-3 h-3 mr-1" />
                              {post.category.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline">
                              {post.post_type}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground mb-4">{post.content}</p>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="gap-2 text-muted-foreground hover:text-red-500"
                            >
                              <Heart className="w-4 h-4" />
                              {post.likes_count}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-muted-foreground"
                              onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              {post.comments_count}
                            </Button>
                          </div>

                          {selectedPost === post.id && (
                            <PostComments postId={post.id} />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsLoading ? (
              <div className="col-span-2 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading events...</p>
              </div>
            ) : events?.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming events. Create one to bring the community together!</p>
                </CardContent>
              </Card>
            ) : (
              events?.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>by {event.profiles?.full_name || 'Anonymous'}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.profiles?.level || 'Eco Starter'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                          {event.current_participants}
                          {event.max_participants && ` / ${event.max_participants}`} participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span>{event.points_reward} points reward</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="capitalize">
                        {event.event_type.replace('_', ' ')}
                      </Badge>
                      {event.status === 'upcoming' && (
                        <Button
                          size="sm"
                          onClick={() => handleJoinEvent(event.id)}
                          disabled={joinEvent.isPending}
                          className="ml-auto"
                        >
                          {joinEvent.isPending ? 'Joining...' : 'Join Event'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="text-primary" />
                Community Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard?.map((user, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-bold">
                      {index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback className="bg-gradient-accent text-white">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{user.full_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {user.level}
                        </Badge>
                        <span>{user.city}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{user.total_points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PostComments: React.FC<{ postId: string }> = ({ postId }) => {
  const { comments, isLoading } = usePostComments(postId);
  const { createComment } = useCommunityMutations();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createComment.mutateAsync({
        post_id: postId,
        content: newComment
      });
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="space-y-3 mb-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : comments?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">No comments yet.</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-accent text-white text-xs">
                  {getInitials(comment.profiles?.full_name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.profiles?.full_name || 'Anonymous'}</span>
                  <Badge variant="outline" className="text-xs">
                    {comment.profiles?.level || 'Eco Starter'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          className="text-sm"
        />
        <Button 
          size="sm" 
          onClick={handleAddComment}
          disabled={createComment.isPending || !newComment.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
};