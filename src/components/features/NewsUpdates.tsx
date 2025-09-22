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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Newspaper, 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  ExternalLink,
  Bell,
  Settings,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Recycle,
  Zap,
  Users,
  Globe
} from 'lucide-react';
import { useNewsArticles, useNewsComments, useNewsMutations, useNewsletterSubscription } from '@/hooks/useNews';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const categoryIcons = {
  general: Globe,
  environmental: Recycle,
  policy: AlertTriangle,
  technology: Zap,
  community: Users,
  recycling: Recycle,
  energy: Lightbulb
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-800',
  environmental: 'bg-green-100 text-green-800',
  policy: 'bg-red-100 text-red-800',
  technology: 'bg-purple-100 text-purple-800',
  community: 'bg-orange-100 text-orange-800',
  recycling: 'bg-emerald-100 text-emerald-800',
  energy: 'bg-yellow-100 text-yellow-800'
};

const typeColors = {
  news: 'bg-blue-100 text-blue-800',
  announcement: 'bg-green-100 text-green-800',
  update: 'bg-orange-100 text-orange-800',
  alert: 'bg-red-100 text-red-800'
};

export const NewsUpdates: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [showNewsletter, setShowNewsletter] = useState(false);

  const { articles, isLoading: articlesLoading } = useNewsArticles(activeCategory);
  const { articles: featuredArticles } = useNewsArticles(undefined, true);
  const { subscription, isLoading: subscriptionLoading } = useNewsletterSubscription();
  const { profile } = useProfile();
  const { createComment, toggleLike, subscribeNewsletter, updateNewsletterSubscription } = useNewsMutations();

  const [newsletterData, setNewsletterData] = useState({
    email: profile?.email || '',
    categories: ['general', 'environmental', 'community'],
    frequency: 'weekly'
  });

  const handleLike = async (articleId: string) => {
    try {
      await toggleLike.mutateAsync({ articleId });
    } catch (error) {
      toast.error('Failed to like article');
    }
  };

  const handleNewsletterSubscribe = async () => {
    if (!newsletterData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      if (subscription) {
        await updateNewsletterSubscription.mutateAsync({
          ...newsletterData,
          frequency: newsletterData.frequency as 'daily' | 'weekly' | 'monthly',
          is_active: true
        });
        toast.success('Newsletter subscription updated!');
      } else {
        await subscribeNewsletter.mutateAsync({
          ...newsletterData,
          frequency: newsletterData.frequency as 'daily' | 'weekly' | 'monthly'
        });
        toast.success('Successfully subscribed to newsletter!');
      }
      setShowNewsletter(false);
    } catch (error) {
      toast.error('Failed to subscribe to newsletter');
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6 animate-fadeInScale">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Newspaper className="text-primary" />
            News & Updates
          </h2>
          <p className="text-muted-foreground mt-2">
            Stay informed about environmental news, policy updates, and community initiatives
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewsletter} onOpenChange={setShowNewsletter}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Bell className="w-4 h-4" />
                Newsletter
                {subscription?.is_active && (
                  <Badge variant="secondary" className="ml-1">Subscribed</Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Newsletter Subscription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Email address"
                  value={newsletterData.email}
                  onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                />
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Categories</label>
                  <div className="space-y-2">
                    {Object.keys(categoryIcons).map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          checked={newsletterData.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewsletterData({
                                ...newsletterData,
                                categories: [...newsletterData.categories, category]
                              });
                            } else {
                              setNewsletterData({
                                ...newsletterData,
                                categories: newsletterData.categories.filter(c => c !== category)
                              });
                            }
                          }}
                        />
                        <label className="text-sm capitalize">{category.replace('_', ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Select value={newsletterData.frequency} onValueChange={(value) => setNewsletterData({ ...newsletterData, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleNewsletterSubscribe} 
                  className="w-full" 
                  disabled={subscribeNewsletter.isPending || updateNewsletterSubscription.isPending}
                >
                  {subscription ? 'Update Subscription' : 'Subscribe'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
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
            {articlesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading articles...</p>
              </div>
            ) : articles?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No articles found in this category.</p>
                </CardContent>
              </Card>
            ) : (
              articles?.map((article) => {
                const CategoryIcon = categoryIcons[article.category as keyof typeof categoryIcons];
                return (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {article.featured_image_url && (
                          <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            <img 
                              src={article.featured_image_url} 
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={categoryColors[article.category as keyof typeof categoryColors]}>
                              <CategoryIcon className="w-3 h-3 mr-1" />
                              {article.category.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={typeColors[article.article_type as keyof typeof typeColors]}>
                              {article.article_type}
                            </Badge>
                            {article.is_featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                            <span className={`text-xs font-medium ${getPriorityColor(article.priority)}`}>
                              {article.priority.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
                            {article.title}
                          </h3>
                          
                          {article.excerpt && (
                            <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>By {article.author_name}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.publish_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views_count} views
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(article.id)}
                              className="gap-2 text-muted-foreground hover:text-red-500"
                            >
                              <Heart className="w-4 h-4" />
                              {article.likes_count}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-muted-foreground"
                              onClick={() => setSelectedArticle(selectedArticle === article.id ? null : article.id)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              Comments
                            </Button>
                            {article.external_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="gap-2 text-muted-foreground"
                              >
                                <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                  Read More
                                </a>
                              </Button>
                            )}
                          </div>

                          {selectedArticle === article.id && (
                            <NewsComments articleId={article.id} />
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

        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles?.map((article) => {
              const CategoryIcon = categoryIcons[article.category as keyof typeof categoryIcons];
              return (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  {article.featured_image_url && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={article.featured_image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryColors[article.category as keyof typeof categoryColors]}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {article.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {article.excerpt && (
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDate(article.publish_date)}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {article.likes_count}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" />
                Trending Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles
                  ?.sort((a, b) => (b.views_count + b.likes_count) - (a.views_count + a.likes_count))
                  ?.slice(0, 5)
                  ?.map((article, index) => (
                    <div key={article.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{article.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.author_name}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {article.likes_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryIcons).map(([category, Icon]) => {
              const categoryArticles = articles?.filter(a => a.category === category) || [];
              return (
                <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setActiveCategory(category)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="text-primary" />
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {categoryArticles.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {categoryArticles.length === 1 ? 'article' : 'articles'} in this category
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NewsComments: React.FC<{ articleId: string }> = ({ articleId }) => {
  const { comments, isLoading } = useNewsComments(articleId);
  const { createComment } = useNewsMutations();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createComment.mutateAsync({
        article_id: articleId,
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