import { useState, useEffect, useRef } from 'react';
import { MarketItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Phone, X, MessageSquare, Check, User as UserIcon } from 'lucide-react';

interface MarketItemCardProps {
  item: MarketItem;
  user: User | null;
  on下架: (itemId: string) => void;
  onAddToCart: (item: MarketItem) => void;
  onPurchase: (item: MarketItem) => void;
}

export function MarketItemCard({ item, user, on下架, onAddToCart, onPurchase }: MarketItemCardProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSellerOnline, setIsSellerOnline] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [tradeRequestStatus, setTradeRequestStatus] = useState<string>('none'); // none, pending, accepted, rejected
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleContact = async () => {
    if (item.status === 'sold') {
      toast.error('商品已售出，无法联系卖家');
      return;
    }
    await initChat();
    setIsChatOpen(true);
  };

  const initChat = async () => {
    if (!user) return;

    // 尝试获取现有的聊天记录
    const { data: existingChat } = await supabase
      .from('chats')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('seller_id', item.seller_id)
      .eq('item_id', item.id)
      .single();

    if (existingChat) {
      setChatId(existingChat.id);
      await loadMessages(existingChat.id);
    } else {
      // 创建新的聊天
      const { data: newChat } = await supabase
        .from('chats')
        .insert({
          buyer_id: user.id,
          seller_id: item.seller_id,
          item_id: item.id,
          item_title: item.title
        })
        .select('id')
        .single();

      if (newChat) {
        setChatId(newChat.id);
        // 只有当卖家在线时才发送欢迎消息
        if (isSellerOnline) {
          await supabase
            .from('messages')
            .insert({
              chat_id: newChat.id,
              sender_id: item.seller_id,
              text: '你好，有什么可以帮助你的吗？',
              sender_type: 'seller'
            });
        }
        await loadMessages(newChat.id);
      }
    }

    // 检查交易请求状态
    const { data: tradeRequest } = await supabase
      .from('trade_requests')
      .select('status')
      .eq('buyer_id', user.id)
      .eq('seller_id', item.seller_id)
      .eq('item_id', item.id)
      .order('created_at', { ascending: false })
      .single();

    if (tradeRequest) {
      setTradeRequestStatus(tradeRequest.status);
    }
  };

  const loadMessages = async (chatId: string) => {
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (messagesData) {
      setMessages(messagesData.map(msg => ({
        id: msg.id,
        sender: msg.sender_type,
        text: msg.text,
        timestamp: msg.created_at
      })));
    }
  };

  // 检测卖家在线状态
  useEffect(() => {
    if (item.seller_id) {
      // 检查卖家当前状态
      const checkSellerStatus = async () => {
        const { data: status } = await supabase
          .from('user_status')
          .select('is_online')
          .eq('user_id', item.seller_id)
          .single();
        setIsSellerOnline(status?.is_online || false);
      };

      checkSellerStatus();

      // 实时监听卖家状态变化
      const statusSubscription = supabase
        .channel(`user-status-${item.seller_id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_status',
          filter: `user_id=eq.${item.seller_id}`
        }, (payload) => {
          setIsSellerOnline(payload.new.is_online);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(statusSubscription);
      };
    }
  }, [item.seller_id]);

  // 更新当前用户在线状态
  useEffect(() => {
    if (user) {
      // 设置用户在线状态
      const updateUserStatus = async () => {
        const { data: existingStatus } = await supabase
          .from('user_status')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingStatus) {
          await supabase
            .from('user_status')
            .update({ is_online: true, last_seen: new Date().toISOString() })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_status')
            .insert({ user_id: user.id, is_online: true, last_seen: new Date().toISOString() });
        }
      };

      updateUserStatus();

      // 页面卸载时设置用户离线
      return () => {
        supabase
          .from('user_status')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('user_id', user.id);
      };
    }
  }, [user]);

  useEffect(() => {
    if (chatId) {
      // 实时监听消息
      const subscription = supabase
        .channel(`chat-${chatId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, (payload) => {
          const newMsg = {
            id: payload.new.id,
            sender: payload.new.sender_type,
            text: payload.new.text,
            timestamp: payload.new.created_at
          };
          setMessages(prev => [...prev, newMsg]);
          
          // 如果消息不是当前用户发送的，显示通知
          if (payload.new.sender_id !== user?.id) {
            toast.success(`收到新消息: ${payload.new.text.substring(0, 20)}...`);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [chatId, user]);

  useEffect(() => {
    // 滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    console.log('sendMessage called');
    console.log('newMessage:', newMessage);
    console.log('user:', user);
    console.log('chatId:', chatId);
    
    if (!newMessage.trim() || !user || !chatId) {
      console.log('Validation failed');
      return;
    }

    try {
      // 发送消息到Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          text: newMessage.trim(),
          sender_type: 'buyer'
        })
        .select();

      console.log('Message sent response:', { data, error });

      if (error) {
        toast.error('发送消息失败');
        console.error('Error sending message:', error);
      } else {
        setNewMessage('');
        console.log('Message sent successfully');
      }
    } catch (err) {
      console.error('Exception sending message:', err);
      toast.error('发送消息时发生异常');
    }
  };

  const handleSendTradeRequest = async () => {
    if (!user) return;
    
    if (item.status === 'sold') {
      toast.error('商品已售出，无法发送交易请求');
      return;
    }
    
    // 创建交易请求
    const { error } = await supabase
      .from('trade_requests')
      .insert({
        buyer_id: user.id,
        seller_id: item.seller_id,
        item_id: item.id,
        item_title: item.title,
        price: item.price_cny,
        status: 'pending'
      });

    if (error) {
      toast.error('发送交易请求失败');
      console.error('Error creating trade request:', error);
    } else {
      toast.success('交易请求已发送，等待卖家确认');
      setTradeRequestStatus('pending');
    }
  };



  const isSeller = user?.id === item.seller_id;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-dopamine-blue/20">
        <div className="aspect-[4/3] relative bg-muted overflow-hidden">
          <Image 
            src={item.image_url || 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=300&q=80'} 
            alt={item.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          {isSeller ? (
            <Button size="sm" variant="destructive" className="w-full font-bold" onClick={() => on下架(item.id)}>
              下架商品
            </Button>
          ) : item.status === 'sold' ? (
            <div className="w-full bg-white/90 text-black font-bold py-2 px-4 rounded-md text-center">
              已售出
            </div>
          ) : (
            <Button 
              size="sm" 
              className="w-full font-bold" 
              onClick={handleContact}
            >
              <Phone className="h-4 w-4 mr-1" />
              联系卖家
            </Button>
          )}
        </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
             <h3 className="font-bold text-lg line-clamp-1 group-hover:text-dopamine-blue transition-colors" title={item.title}>{item.title}</h3>
             <span className="font-black text-dopamine-orange text-lg whitespace-nowrap ml-2">
               {item.price_cny > 0 ? `¥${item.price_cny}` : '免费'}
             </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{item.description}</p>
          <div className="pt-3 border-t flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
               <span>发布于近期</span>
               <span className="bg-muted px-2 py-1 rounded-md">{isSeller ? '我的闲置' : '个人闲置'}</span>
            </div>

          </div>
        </div>
      </Card>

      {/* 聊天模态框 */}
    {isChatOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
          <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold">与卖家沟通</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <div className={`h-2 w-2 rounded-full ${isSellerOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span>{isSellerOnline ? '卖家在线' : '卖家离线'}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <MessageSquare className="h-12 w-12 opacity-20" />
                <p className="mt-4">暂无消息</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'seller' && (
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-2 flex-shrink-0">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'buyer' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'buyer' && (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center ml-2 flex-shrink-0">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t dark:border-slate-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="输入消息..."
                className="flex-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={sendMessage}>
                发送
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {!isSeller && (
                <>
                  {item.status === 'sold' && (
                    <div className="flex items-center justify-center py-3 bg-gray-100 text-gray-700 rounded-lg">
                      商品已售出
                    </div>
                  )}
                  {item.status !== 'sold' && tradeRequestStatus !== 'accepted' && (
                    <>
                      {tradeRequestStatus === 'none' && (
                        <Button 
                          className="w-full bg-blue-500 hover:bg-blue-600"
                          onClick={handleSendTradeRequest}
                        >
                          发送交易请求
                        </Button>
                      )}
                      {tradeRequestStatus === 'pending' && (
                        <div className="flex items-center justify-center py-3 bg-yellow-100 text-yellow-700 rounded-lg">
                          等待卖家确认...
                        </div>
                      )}
                      {tradeRequestStatus === 'rejected' && (
                        <div className="flex items-center justify-center py-3 bg-red-100 text-red-700 rounded-lg">
                          交易已被卖家拒绝
                        </div>
                      )}
                    </>
                  )}
                  {tradeRequestStatus === 'accepted' && (
                    <div className="flex items-center justify-center py-3 bg-green-100 text-green-700 rounded-lg">
                      交易已完成，商品已添加到订单
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
