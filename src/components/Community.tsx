import React, { useState } from 'react';
import { User } from '../types';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Video, MapPin, MoreHorizontal, Bookmark } from 'lucide-react';

interface CommunityProps {
  user: User;
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
  timestamp: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  location?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  commentsList: {
    id: string;
    user: string;
    avatar: string;
    text: string;
    likes: number;
    timestamp: string;
  }[];
}

const Community: React.FC<CommunityProps> = ({ user }) => {
  const [filter, setFilter] = useState<'all' | 'photos' | 'videos' | 'reviews'>('all');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        name: 'Sarah Mitchell',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        location: 'Santorini, Greece'
      },
      timestamp: '2 hours ago',
      content: 'Just watched the most incredible sunset from Oia! The colors were absolutely stunning. Santorini has completely stolen my heart 🌅💙 Can\'t wait to explore more of these beautiful islands!',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200&auto=format&fit=crop' }
      ],
      location: 'Oia, Santorini',
      likes: 247,
      comments: 32,
      isLiked: false,
      commentsList: [
        {
          id: 'c1',
          user: 'Emma Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          text: 'This is on my bucket list! How long did you stay?',
          likes: 12,
          timestamp: '1 hour ago'
        },
        {
          id: 'c2',
          user: 'James Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          text: 'Stunning photos! The sunset there is unmatched',
          likes: 8,
          timestamp: '45 min ago'
        }
      ]
    },
    {
      id: '2',
      user: {
        name: 'James Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        location: 'Kyoto, Japan'
      },
      timestamp: '5 hours ago',
      content: 'Walking through the bamboo forest at Arashiyama 🎋 The serenity here is something else. Every corner of Kyoto feels like a living postcard!',
      media: [
        { type: 'video', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop' }
      ],
      location: 'Arashiyama, Kyoto',
      likes: 189,
      comments: 24,
      isLiked: true,
      commentsList: [
        {
          id: 'c3',
          user: 'Maria Santos',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          text: 'I was there last spring! Did you visit Fushimi Inari?',
          likes: 5,
          timestamp: '3 hours ago'
        }
      ]
    },
    {
      id: '3',
      user: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        location: 'Reykjavik, Iceland'
      },
      timestamp: '1 day ago',
      content: 'Finally saw the Northern Lights! 🌌 After 4 nights of waiting, nature put on the most spectacular show. Iceland, you are magical! ✨',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=1200&auto=format&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1200&auto=format&fit=crop' }
      ],
      location: 'Reykjavik, Iceland',
      likes: 342,
      comments: 45,
      isLiked: true,
      commentsList: [
        {
          id: 'c4',
          user: 'Alex Turner',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
          text: 'Absolutely breathtaking! What time of year did you go?',
          likes: 15,
          timestamp: '20 hours ago'
        },
        {
          id: 'c5',
          user: 'Lisa Wang',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
          text: 'This is incredible! Adding Iceland to my list',
          likes: 9,
          timestamp: '18 hours ago'
        }
      ]
    },
    {
      id: '4',
      user: {
        name: 'Marco Rossi',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        location: 'Venice, Italy'
      },
      timestamp: '2 days ago',
      content: 'Early morning gondola ride through the canals 🛶 Venice before the crowds is pure poetry. The reflections in the water are mesmerizing!',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop' }
      ],
      location: 'Grand Canal, Venice',
      likes: 156,
      comments: 18,
      isLiked: false,
      commentsList: []
    },
    {
      id: '5',
      user: {
        name: 'Aisha Patel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        location: 'Dubai, UAE'
      },
      timestamp: '3 days ago',
      content: 'Sunset from the top of Burj Khalifa! The view of the city transforming from day to night is absolutely surreal 🌆 Dubai never disappoints!',
      media: [
        { type: 'video', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop' }
      ],
      location: 'Burj Khalifa, Dubai',
      likes: 278,
      comments: 36,
      isLiked: false,
      commentsList: [
        {
          id: 'c6',
          user: 'Omar Hassan',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          text: 'The skyline view is unmatched! Did you visit the fountain show?',
          likes: 7,
          timestamp: '2 days ago'
        }
      ]
    }
  ]);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    if (newComment.trim()) {
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [
                {
                  id: `c${Date.now()}`,
                  user: user.name,
                  avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                  text: newComment,
                  likes: 0,
                  timestamp: 'Just now'
                },
                ...post.commentsList
              ]
            }
          : post
      ));
      setNewComment('');
    }
  };

  const filters = [
    { id: 'all', label: 'All Posts', icon: '🌍' },
    { id: 'photos', label: 'Photos', icon: '📸' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold font-heading">Community</h1>
          <p className="text-white/60">Share your adventures, connect with fellow travelers</p>
        </div>

        {/* Create Post Card */}
        <div className="glass border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <input
              type="text"
              placeholder="Share your travel story..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 pl-16">
            <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              <ImageIcon className="w-4 h-4" />
              Photo
            </button>
            <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              <Video className="w-4 h-4" />
              Video
            </button>
            <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
              Location
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              <span className="mr-2">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="glass border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <h3 className="font-bold">{post.user.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>{post.timestamp}</span>
                        {post.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {post.location}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-white/80 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Media */}
              {post.media && post.media.length > 0 && (
                <div className={`grid gap-1 ${post.media.length === 1 ? 'grid-cols-1' : post.media.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {post.media.map((media, idx) => (
                    <div key={idx} className={`relative ${post.media!.length === 3 && idx === 0 ? 'col-span-2' : ''} ${post.media!.length === 1 ? 'aspect-[4/3]' : 'aspect-square'} bg-black/20 overflow-hidden`}>
                      {media.type === 'video' ? (
                        <div className="relative w-full h-full group cursor-pointer">
                          <img 
                            src={media.url}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[16px] border-l-black border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={media.url}
                          alt="Post"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-2 group"
                    >
                      <Heart 
                        className={`w-6 h-6 transition-all ${
                          post.isLiked 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-white/60 group-hover:text-red-500 group-hover:scale-110'
                        }`}
                      />
                      <span className={`font-medium ${post.isLiked ? 'text-red-500' : 'text-white/60'}`}>
                        {post.likes}
                      </span>
                    </button>
                    <button 
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                    >
                      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                      <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <Bookmark className="w-6 h-6 hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Comments Section */}
                {showComments === post.id && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    {post.commentsList.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <img 
                          src={comment.avatar}
                          alt={comment.user}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-2xl px-4 py-3">
                            <h4 className="font-bold text-sm mb-1">{comment.user}</h4>
                            <p className="text-sm text-white/80">{comment.text}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 px-4">
                            <button className="text-xs text-white/40 hover:text-white transition-colors">
                              {comment.timestamp}
                            </button>
                            <button className="text-xs text-white/40 hover:text-white transition-colors font-medium">
                              Like · {comment.likes}
                            </button>
                            <button className="text-xs text-white/40 hover:text-white transition-colors font-medium">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex items-center gap-3 pt-2">
                      <img 
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                      <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/10 focus-within:border-white/30 transition-all">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          className="flex-1 bg-transparent focus:outline-none text-sm"
                        />
                        <button 
                          onClick={() => handleComment(post.id)}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="px-8 py-4 rounded-2xl border border-white/20 hover:border-white hover:bg-white/5 transition-all font-medium">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
