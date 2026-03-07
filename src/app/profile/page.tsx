'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { ShoppingCart, Package, User as UserIcon, Home, Edit, Trash2, Plus, MapPin, Phone, Mail, CreditCard, X, MessageSquare, LogOut, Settings, ChevronRight, Shield, Bell, CheckCircle2, Clock, Truck, Send, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=300&q=80';

interface CartItem {
  id: string;
  product_id: string;
  product_type: 'mall' | 'marketplace';
  title: string;
  price: string | number;
  image_url: string;
  quantity: number;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  product_type: 'mall' | 'marketplace';
  title: string;
  price: string | number;
  quantity: number;
  image_url?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  is_default: boolean;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_type: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  item_id: string;
  item_title: string;
  messages: Message[];
  last_message: string;
  last_message_time: string;
  unread: boolean;
  is_online?: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState('cart');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('alipay');
  // 修改密码相关状态
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // 头像相关状态
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // 署名相关状态
  const [username, setUsername] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] = useState(false);
  const [updatingUsername, setUpdatingUsername] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

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
      const setOffline = async () => {
        if (user) {
          await supabase
            .from('user_status')
            .update({ is_online: false, last_seen: new Date().toISOString() })
            .eq('user_id', user.id);
        }
      };

      window.addEventListener('beforeunload', setOffline);

      return () => {
        window.removeEventListener('beforeunload', setOffline);
        setOffline();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getProfile();
      fetchCartItems();
      fetchOrders();
      fetchAddresses();
      fetchChats();
      fetchTradeRequests();

      // 实时监听购物车变化
      const cartSubscription = supabase
        .channel(`cart-${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_cart_items',
          filter: `user_id=eq.${user.id}`
        }, () => {
          // 购物车发生变化时重新获取数据
          fetchCartItems();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(cartSubscription);
      };
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user) return;

    // 获取用户参与的所有聊天
    const { data: chatsData, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

    if (chatsError) {
      console.error('Error fetching chats:', chatsError);
      return;
    }

    if (chatsData) {
      // 为每个聊天获取最新消息
      const chatsWithMessages = await Promise.all(
        chatsData.map(async (chat) => {
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: true });

          const messages = messagesData || [];
          const lastMessage = messages[messages.length - 1];

          // 获取对方的在线状态
          const otherUserId = user.id === chat.buyer_id ? chat.seller_id : chat.buyer_id;
          const { data: statusData } = await supabase
            .from('user_status')
            .select('is_online')
            .eq('user_id', otherUserId)
            .single();

          return {
            id: chat.id,
            buyer_id: chat.buyer_id,
            seller_id: chat.seller_id,
            item_id: chat.item_id,
            item_title: chat.item_title,
            messages,
            last_message: lastMessage?.text || '',
            last_message_time: lastMessage?.created_at || chat.created_at,
            unread: messages.some(msg => msg.sender_id !== user.id && !msg.read),
            is_online: statusData?.is_online || false
          };
        })
      );

      // 按最后消息时间排序
      chatsWithMessages.sort((a, b) => 
        new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      );

      setChats(chatsWithMessages);
    }
  };

  // 实时监听用户状态变化
  useEffect(() => {
    if (user && chats.length > 0) {
      const subscription = supabase
        .channel('user-status-changes')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_status'
        }, (payload) => {
          setChats(prevChats => prevChats.map(chat => {
            const otherUserId = user.id === chat.buyer_id ? chat.seller_id : chat.buyer_id;
            if (payload.new.user_id === otherUserId) {
              return { ...chat, is_online: payload.new.is_online };
            }
            return chat;
          }));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user, chats.length]);

  // 实时监听新消息
  useEffect(() => {
    if (user) {
      // 监听所有与用户相关的消息
      const subscription = supabase
        .channel('user-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id.neq.${user.id}`
        }, async (payload) => {
          // 检查消息是否属于用户参与的聊天
          const { data: chatData } = await supabase
            .from('chats')
            .select('*')
            .eq('id', payload.new.chat_id)
            .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
            .single();

          if (chatData) {
            // 显示通知
            toast.success(`收到新消息: ${payload.new.text.substring(0, 20)}...`);
            // 重新获取聊天记录以更新界面
            await fetchChats();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  const getProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      }
      
      if (data) {
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.username) {
          setUsername(data.username);
          setNewUsername(data.username);
        }
      }
    } catch (error) {
      console.error('Error in getProfile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('请选择要上传的图片');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/avatar-${Date.now()}.${fileExt}`;
      
      // 上传到Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 更新Profile表
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast.success('头像更新成功');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('上传头像失败: ' + (error.message || '未知错误'));
    } finally {
      setUploading(false);
    }
  };

  const fetchCartItems = async () => {
    if (!user) return;
    
    // 从Supabase获取用户的购物车数据
    const { data: cartData, error } = await supabase
      .from('user_cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
      return;
    }
    
    if (cartData) {
      setCartItems(cartData);
    } else {
      setCartItems([]);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    // 首先从Supabase获取用户的订单数据
    const { data: ordersData, error } = await supabase
      .from('user_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      setOrders([]);
      return;
    }
    
    if (ordersData) {
      // 为每个订单获取商品详情
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);
          
          // 为每个订单项获取图片
          const itemsWithImages = await Promise.all((orderItems || []).map(async (item: any) => {
            let imageUrl = item.image_url;
            
            // 如果订单项中没有图片，尝试从对应的商品表中获取（兼容旧数据）
            if (!imageUrl) {
              if (item.product_type === 'mall') {
                const { data: product } = await supabase
                  .from('mall_items')
                  .select('image_url')
                  .eq('id', item.product_id)
                  .single();
                imageUrl = product?.image_url;
              } else if (item.product_type === 'marketplace') {
                const { data: product } = await supabase
                  .from('marketplace_items')
                  .select('image_url')
                  .eq('id', item.product_id)
                  .single();
                imageUrl = product?.image_url;
              }
            }
            return { ...item, image_url: imageUrl };
          }));

          return {
            ...order,
            items: itemsWithImages
          };
        })
      );
      
      setOrders(ordersWithItems);
    } else {
      setOrders([]);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;
    
    // 首先从Supabase获取用户的地址数据
    const { data: addressesData, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    
    if (error) {
      console.error('Error fetching addresses from Supabase:', error);
      setAddresses([]);
      return;
    }
    
    if (addressesData) {
      setAddresses(addressesData);
    } else {
      setAddresses([]);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error removing from cart:', error);
      toast.error('从购物车移除失败');
      return;
    }
    
    // 重新获取购物车数据
    await fetchCartItems();
    toast.success('已从购物车移除');
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1 || !user) return;
    
    const { error } = await supabase
      .from('user_cart_items')
      .update({ quantity: quantity })
      .eq('id', itemId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating quantity:', error);
      toast.error('更新数量失败');
      return;
    }
    
    // 重新获取购物车数据
    await fetchCartItems();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('购物车为空');
      return;
    }
    
    // 设置结算商品
    setCheckoutItems(cartItems);
    
    // 自动选择默认地址
    const defaultAddress = addresses.find(addr => addr.is_default);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
    
    // 打开结算模态框
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = async () => {
    if (!selectedAddress || !user) {
      toast.error('请选择收货地址');
      return;
    }
    
    // 计算订单总金额和总积分
    let totalAmount = 0;
    let totalPoints = 0;
    
    checkoutItems.forEach(item => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price;
      if (item.product_type === 'mall') {
        totalPoints += price * item.quantity;
      } else {
        totalAmount += price * item.quantity;
      }
    });
    
    // 检查积分是否足够
    if (totalPoints > 0) {
      // 从服务器获取最新积分
      const { data: profileData } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
      
      const currentServerCredits = profileData?.credits || 0;
      
      if (currentServerCredits < totalPoints) {
        toast.error(`积分不足 (服务器: ${currentServerCredits}, 需要: ${totalPoints})`);
        return;
      }
      
      // 扣除积分
      for (const item of checkoutItems) {
        if (item.product_type === 'mall') {
          const { error } = await supabase.rpc('redeem_item', { item_id: item.product_id, user_id: user.id });
          if (error) {
            toast.error('兑换失败: ' + error.message);
            return;
          }
        }
      }
    }
    
    // 创建新订单
    const { data: orderData, error: orderError } = await supabase
      .from('user_orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount + totalPoints,
        status: '已完成',
        address_id: selectedAddress.id
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      toast.error('创建订单失败');
      return;
    }
    
    // 创建订单商品
    let allItemsCreated = true;
    for (const item of checkoutItems) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: item.product_id,
          title: item.title,
          price: typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price,
          quantity: item.quantity
        });
      
      if (itemError) {
        console.error('Error creating order item:', itemError);
        allItemsCreated = false;
        // 继续创建其他订单项，不立即返回
      }
    }
    
    // 清空购物车
    for (const item of checkoutItems) {
      await supabase
        .from('user_cart_items')
        .delete()
        .eq('id', item.id)
        .eq('user_id', user.id);
    }
    
    // 重新获取订单和购物车数据
    await fetchOrders();
    await fetchCartItems();
    
    // 关闭模态框
    setIsCheckoutModalOpen(false);
    
    if (allItemsCreated) {
      toast.success('订单已提交');
    } else {
      toast.success('订单已创建，但部分商品添加失败');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address || !user) {
      toast.error('请填写完整地址信息');
      return;
    }
    
    // 检查是否需要设置为默认地址
    let is_default = false;
    if (addresses.length === 0) {
      is_default = true;
    }
    
    const { error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user.id,
        name: newAddress.name,
        phone: newAddress.phone,
        address: newAddress.address,
        is_default: is_default
      });
    
    if (error) {
      console.error('Error adding address:', error);
      toast.error('添加地址失败');
      return;
    }
    
    // 重新获取地址数据
    await fetchAddresses();
    setNewAddress({ name: '', phone: '', address: '' });
    setIsAddingAddress(false);
    toast.success('地址添加成功');
  };

  const handleEditAddress = async (address: Address) => {
    if (!user) return;
    
    // 先删除原地址
    const { error: deleteError } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', address.id)
      .eq('user_id', user.id);
    
    if (deleteError) {
      console.error('Error deleting address:', deleteError);
      toast.error('编辑地址失败');
      return;
    }
    
    // 然后设置新地址表单
    setNewAddress({
      name: address.name,
      phone: address.phone,
      address: address.address
    });
    setIsAddingAddress(true);
    
    // 重新获取地址数据
    await fetchAddresses();
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting address:', error);
      toast.error('删除地址失败');
      return;
    }
    
    // 重新获取地址数据
    await fetchAddresses();
    toast.success('地址已删除');
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!user) return;
    
    try {
      // 首先删除订单商品
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);
      
      if (itemsError) {
        console.error('Error deleting order items:', itemsError);
        // 继续执行，尝试删除订单
      }
      
      // 然后删除订单
      const { error } = await supabase
        .from('user_orders')
        .delete()
        .eq('id', orderId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting order:', error);
        toast.error('删除订单失败: ' + error.message);
        return;
      }
      
      // 重新获取订单数据
      await fetchOrders();
      toast.success('订单已删除');
    } catch (error) {
      console.error('Exception deleting order:', error);
      toast.error('删除订单时发生异常');
    }
  };

  const sendMessage = async (chatId: string) => {
    if (!newMessage.trim() || !user) return;

    try {
      // 发送消息到Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          text: newMessage.trim(),
          sender_type: user.id === chats.find(c => c.id === chatId)?.seller_id ? 'seller' : 'buyer'
        })
        .select();

      if (error) {
        toast.error('发送消息失败');
        console.error('Error sending message:', error);
      } else {
        setNewMessage('');
        // 重新获取聊天记录以更新界面
        await fetchChats();
      }
    } catch (err) {
      console.error('Exception sending message:', err);
      toast.error('发送消息时发生异常');
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!user) return;
    
    if (!window.confirm('确定要删除这个聊天吗？删除后无法恢复。')) {
      return;
    }

    try {
      // 首先删除消息
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
      }

      // 然后删除聊天
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (error) {
        console.error('Error deleting chat:', error);
        toast.error('删除聊天失败');
        return;
      }

      toast.success('聊天已删除');
      
      // 更新本地状态
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
    } catch (err) {
      console.error('Exception deleting chat:', err);
      toast.error('删除聊天时发生异常');
    }
  };

  // 交易请求相关状态
  const [tradeRequests, setTradeRequests] = useState<any[]>([]);

  const fetchTradeRequests = async () => {
    if (!user) return;

    // 获取用户作为卖家收到的交易请求
    const { data: sellerRequests } = await supabase
      .from('trade_requests')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    // 获取用户作为买家发送的交易请求
    const { data: buyerRequests } = await supabase
      .from('trade_requests')
      .select('*')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    // 合并并去重
    const allRequests = [...(sellerRequests || []), ...(buyerRequests || [])];
    const uniqueRequests = Array.from(new Map(allRequests.map(req => [req.id, req])).values());
    setTradeRequests(uniqueRequests);
  };

  const handleAcceptTrade = async (requestId: string, request: any) => {
    if (!user) return;

    try {
      // 更新交易请求状态为已接受
      const { error: updateError } = await supabase
        .from('trade_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .eq('seller_id', user.id);

      if (updateError) {
        toast.error('接受交易失败');
        console.error('Error accepting trade:', updateError);
        return;
      }

      // 获取商品详细信息
      const { data: itemData, error: itemError } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', request.item_id)
        .single();

      if (itemError) {
        console.error('Error fetching item:', itemError);
        toast.error('获取商品信息失败');
        return;
      }

      // 创建订单
      const { data: orderData, error: orderError } = await supabase
        .from('user_orders')
        .insert({
          user_id: request.buyer_id,
          total_amount: itemData.price_cny,
          status: '已完成'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('创建订单失败');
        return;
      }

      // 创建订单项
      const { error: itemError2 } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: itemData.id,
          product_type: 'marketplace',
          title: itemData.title,
          price: itemData.price_cny,
          quantity: 1
        });

      if (itemError2) {
        console.error('Error creating order item:', itemError2);
        toast.error('创建订单项失败');
        return;
      }

      // 更新商品状态为已售出
      const { error: updateItemError } = await supabase
        .from('marketplace_items')
        .update({ status: 'sold' })
        .eq('id', itemData.id);

      if (updateItemError) {
        console.error('Error updating item status:', updateItemError);
      }

      // 发送订单给买家
      toast.success('交易已接受，商品已添加到买家订单');
      await fetchTradeRequests();
    } catch (err) {
      console.error('Exception accepting trade:', err);
      toast.error('接受交易时发生异常');
    }
  };

  const handleRejectTrade = async (requestId: string) => {
    if (!user) return;

    try {
      // 更新交易请求状态为已拒绝
      const { error: updateError } = await supabase
        .from('trade_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)
        .eq('seller_id', user.id);

      if (updateError) {
        toast.error('拒绝交易失败');
        console.error('Error rejecting trade:', updateError);
        return;
      }

      toast.success('交易已拒绝');
      await fetchTradeRequests();
    } catch (err) {
      console.error('Exception rejecting trade:', err);
      toast.error('拒绝交易时发生异常');
    }
  };

  const handleCancelTradeRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('trade_requests')
        .delete()
        .eq('id', requestId)
        .eq('buyer_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error canceling trade request:', error);
        toast.error('取消请求失败');
        return;
      }

      toast.success('请求已取消');
      await fetchTradeRequests();
    } catch (err) {
      console.error('Exception canceling trade request:', err);
      toast.error('取消请求时发生异常');
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    // 验证密码
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('请填写所有密码字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('新密码和确认密码不一致');
      return;
    }

    try {
      // 首先使用当前密码重新验证用户
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword
      });

      if (reauthError) {
        toast.error('当前密码错误');
        console.error('Reauth error:', reauthError);
        return;
      }

      // 然后更新密码
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast.error('修改密码失败');
        console.error('Update password error:', updateError);
        return;
      }

      toast.success('密码修改成功');
      setIsChangePasswordModalOpen(false);
      // 重置表单
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Exception changing password:', err);
      toast.error('修改密码时发生异常');
    }
  };

  const handleUpdateUsername = async () => {
    if (!user || !newUsername.trim() || updatingUsername) return;

    if (newUsername.trim().length < 3) {
      toast.error('署名长度至少为3个字符');
      return;
    }

    if (newUsername.trim().length > 20) {
      toast.error('署名长度不能超过20个字符');
      return;
    }

    try {
      setUpdatingUsername(true);
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername.trim() })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          toast.error('该署名已被占用');
        } else {
          toast.error('更新署名失败');
          console.error('Error updating username:', error);
        }
        return;
      }

      setUsername(newUsername.trim());
      setIsChangeUsernameModalOpen(false);
      toast.success('署名更新成功');
    } catch (err) {
      console.error('Exception updating username:', err);
      toast.error('更新署名时发生异常');
    } finally {
      setUpdatingUsername(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12 px-4 md:px-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="p-8 text-center border-none shadow-xl rounded-[2.5rem] bg-white/70 backdrop-blur-xl">
            <CardContent className="space-y-6 pt-6">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800">请先登录</h2>
                <p className="text-slate-500">登录后查看个人中心，管理您的订单和设置</p>
              </div>
              <Button className="w-full rounded-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/20">立即登录</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 -z-20" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 translate-x-1/3 translate-y-1/3" />


      <div className="container max-w-5xl mx-auto py-12 px-4 md:px-6 space-y-8 relative z-10">
        {/* 个人信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none shadow-2xl shadow-green-900/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] relative group">
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 -z-10" />
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-200/20 rounded-full blur-3xl group-hover:bg-green-300/30 transition-all duration-700" />
            
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative group/avatar cursor-pointer">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 p-[3px] shadow-lg shadow-green-500/20 overflow-hidden">
                  <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-600">
                        {(username || user.email)?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                      <Camera className="text-white h-8 w-8" />
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white dark:border-slate-900 w-8 h-8 rounded-full flex items-center justify-center z-10 pointer-events-none">
                  <Edit className="h-4 w-4 text-white" />
                </div>
                
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
                <label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer" />
              </div>
              
              <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-3">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">{username || user.email?.split('@')[0]}</h1>
                  <span className="text-sm text-slate-500 pb-1.5">{user.email}</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <Shield className="mr-1.5 h-3 w-3" />
                    已认证用户
                  </div>
                  <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Package className="mr-1.5 h-3 w-3" />
                    订单: {orders.length}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                 <Button 
                   variant="outline" 
                   className="rounded-full border-2 border-slate-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all"
                   onClick={() => setActiveTab('settings')}
                 >
                   <Settings className="h-4 w-4 mr-2" />
                   设置
                 </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 功能标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-4 md:pb-0">
            <TabsList className="h-14 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none inline-flex min-w-max">
              <TabsTrigger 
                value="cart" 
                className="px-6 h-full rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300 font-bold gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                购物车
                {cartItems.length > 0 && <span className="bg-white text-green-600 text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">{cartItems.length}</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="px-6 h-full rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300 font-bold gap-2"
              >
                <Package className="h-4 w-4" />
                我的订单
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="px-6 h-full rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300 font-bold gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                我的消息
                {chats.some(c => c.unread) && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger 
                value="trade-requests" 
                className="px-6 h-full rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300 font-bold gap-2"
              >
                <Bell className="h-4 w-4" />
                交易请求
                {tradeRequests.some(r => r.status === 'pending') && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="px-6 h-full rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300 font-bold gap-2"
              >
                <MapPin className="h-4 w-4" />
                收货地址
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="px-6 h-full rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300 font-bold gap-2"
              >
                <Settings className="h-4 w-4" />
                设置
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'cart' ? (
              <TabsContent value="cart" forceMount={true} key="cart" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <CardTitle className="text-2xl font-black flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-green-500" />
                        我的购物车
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-6">
                          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <ShoppingCart className="h-10 w-10 text-slate-300" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-xl font-bold text-slate-700 dark:text-slate-200">购物车是空的</p>
                            <p className="text-slate-500">快去选购心仪的环保好物吧！</p>
                          </div>
                          <Button className="rounded-full px-8 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20">去购物</Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-900/30">
                              <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                <img 
                                  src={item.image_url} 
                                  alt={item.title} 
                                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
                                <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                                <p className="text-green-600 font-black text-xl">¥{typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price}</p>
                                <div className="inline-flex items-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-md"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-md"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-10 w-10"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800/50 gap-4">
                            <div className="flex items-end gap-2">
                              <span className="text-slate-500 font-bold mb-1">总计</span>
                              <span className="text-3xl font-black text-green-600">
                                ¥{cartItems.reduce((total, item) => {
                                  const price = typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price;
                                  return total + price * item.quantity;
                                }, 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                              <Button variant="outline" className="flex-1 md:flex-none rounded-full border-2 font-bold h-12">继续购物</Button>
                              <Button onClick={handleCheckout} className="flex-1 md:flex-none rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-12 px-8 shadow-lg shadow-green-500/20">立即结算</Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : activeTab === 'orders' ? (
              <TabsContent value="orders" forceMount={true} key="orders" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <CardTitle className="text-2xl font-black flex items-center gap-2">
                        <Package className="h-6 w-6 text-green-500" />
                        我的订单
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-6">
                          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Package className="h-10 w-10 text-slate-300" />
                          </div>
                          <p className="text-xl font-bold text-slate-700 dark:text-slate-200">暂无订单</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div key={order.id} className="border border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-500">订单号</span>
                                    <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    {new Date(order.created_at).toLocaleString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                                    order.status === '已完成' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    order.status === '处理中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {order.status === '已完成' && <CheckCircle2 className="h-4 w-4" />}
                                    {order.status === '处理中' && <Truck className="h-4 w-4" />}
                                    {order.status}
                                  </span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                    onClick={() => handleDeleteOrder(order.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-4 mb-6">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                      <img 
                                        src={item.image_url || DEFAULT_IMAGE} 
                                        alt={item.title} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2">{item.title}</h4>
                                        <span className="font-bold text-sm ml-2 whitespace-nowrap">
                                          {item.product_type === 'mall' ? `${item.price} 积分` : `¥${typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price}`}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                          {item.product_type === 'mall' ? '积分兑换' : '二手交易'}
                                        </span>
                                        <span className="text-sm text-slate-500">× {item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                                <span className="font-bold text-slate-500">实付款</span>
                                <span className="font-black text-xl text-green-600">
                                  {order.items.some(item => item.product_type === 'mall') ? 
                                    `积分: ${order.items.reduce((total, item) => item.product_type === 'mall' ? total + (typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price) * item.quantity : total, 0)}` : 
                                    `¥${order.total_amount.toFixed(2)}`
                                  }
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : activeTab === 'messages' ? (
              <TabsContent value="messages" forceMount={true} key="messages" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <CardTitle className="text-2xl font-black flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-green-500" />
                        我的消息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 h-[650px]">
                        {/* 消息列表 */}
                        <div className="md:col-span-1 border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 p-4 overflow-y-auto custom-scrollbar">
                          {chats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-4">
                              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                <MessageSquare className="h-8 w-8 text-slate-300" />
                              </div>
                              <p className="font-bold text-sm">暂无消息</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {chats.map((chat) => (
                                <div
                                  key={chat.id}
                                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 group relative border ${
                                    activeChatId === chat.id 
                                      ? 'bg-white dark:bg-slate-800 shadow-lg shadow-green-900/5 border-green-200 dark:border-green-800 scale-[1.02]' 
                                      : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border-transparent hover:shadow-md'
                                  }`}
                                  onClick={() => setActiveChatId(chat.id)}
                                >
                                  <div className="flex gap-4">
                                    <div className="relative">
                                      <div className={`h-12 w-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-black shadow-sm transition-colors ${
                                        activeChatId === chat.id 
                                          ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' 
                                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 group-hover:bg-green-100 group-hover:text-green-600 dark:group-hover:bg-green-900/30 dark:group-hover:text-green-400'
                                      }`}>
                                        {chat.item_title.charAt(0)}
                                      </div>
                                      {chat.is_online && (
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0 py-0.5">
                                      <div className="flex justify-between items-start mb-1.5">
                                        <h3 className={`font-bold line-clamp-1 text-sm ${
                                          activeChatId === chat.id ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'
                                        }`}>
                                          {chat.item_title}
                                        </h3>
                                        <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                                          {new Date(chat.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center">
                                        <p className={`text-xs line-clamp-1 ${
                                          activeChatId === chat.id ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500'
                                        }`}>
                                          {chat.last_message}
                                        </p>
                                        {chat.unread && (
                                          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse flex-shrink-0 ml-2" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    title="删除聊天"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 聊天界面 */}
                        <div className="md:col-span-2 flex flex-col bg-white dark:bg-slate-900/50 relative">
                          {activeChatId ? (
                            <>
                              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center border border-green-200 dark:border-green-800">
                                  <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    {chats.find(c => c.id === activeChatId)?.item_title}
                                    {chats.find(c => c.id === activeChatId)?.is_online ? (
                                      <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        在线
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        离线
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-xs text-slate-400">
                                    交易商品咨询
                                  </p>
                                </div>
                              </div>

                              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
                                {chats.find(c => c.id === activeChatId)?.messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div className="flex items-end gap-2 max-w-[75%]">
                                      {message.sender_id !== user?.id && (
                                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                                          {chats.find(c => c.id === activeChatId)?.item_title.charAt(0)}
                                        </div>
                                      )}
                                      
                                      <div
                                        className={`p-4 rounded-2xl shadow-sm relative group transition-all hover:shadow-md ${
                                          message.sender_id === user?.id 
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-tr-sm' 
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700'
                                        }`}
                                      >
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <p className={`text-[10px] mt-1.5 text-right font-medium opacity-70 ${message.sender_id === user?.id ? 'text-green-100' : 'text-slate-400'}`}>
                                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 dark:focus-within:ring-green-900/20 transition-all shadow-sm">
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                                    <Plus className="h-5 w-5" />
                                  </Button>
                                  <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(activeChatId!)}
                                    placeholder="输入消息..."
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm min-h-[24px] px-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                                  />
                                  <Button 
                                    onClick={() => sendMessage(activeChatId!)} 
                                    size="icon" 
                                    className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-9 w-9 shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95"
                                  >
                                    <Send className="h-4 w-4 text-white ml-0.5" />
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6">
                              <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-green-50 dark:bg-slate-800/50 flex items-center justify-center animate-pulse">
                                  <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center">
                                    <MessageSquare className="h-10 w-10 text-green-500/50" />
                                  </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce delay-700">
                                  <span className="text-xl">👋</span>
                                </div>
                              </div>
                              <div className="text-center space-y-2">
                                <p className="font-black text-xl text-slate-700 dark:text-slate-200">开始聊天</p>
                                <p className="text-sm max-w-xs mx-auto">选择左侧的对话，与买家或卖家进行实时沟通</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : activeTab === 'trade-requests' ? (
              <TabsContent value="trade-requests" forceMount={true} key="trade-requests" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <CardTitle className="text-2xl font-black flex items-center gap-2">
                        <Bell className="h-6 w-6 text-green-500" />
                        交易请求
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      {tradeRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-6">
                          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Bell className="h-10 w-10 text-slate-300" />
                          </div>
                          <p className="text-xl font-bold text-slate-700 dark:text-slate-200">暂无交易请求</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {tradeRequests.map((request) => (
                            <div key={request.id} className="border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 hover:shadow-lg transition-all bg-white dark:bg-slate-900/50">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">{request.item_title}</h3>
                                  <p className="text-green-600 font-bold text-xl">¥{request.price}</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                  request.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {request.status === 'pending' ? '待处理' : request.status === 'accepted' ? '已接受' : '已拒绝'}
                                </span>
                              </div>
                              <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                                <div className="text-sm text-slate-500">
                                  <p className="mb-1">请求时间：{new Date(request.created_at).toLocaleString()}</p>
                                  {user?.id === request.seller_id ? (
                                    <p>买家ID：{request.buyer_id.slice(0, 8)}...</p>
                                  ) : (
                                    <p>卖家ID：{request.seller_id.slice(0, 8)}...</p>
                                  )}
                                </div>
                                {user?.id === request.seller_id && request.status === 'pending' && (
                                  <div className="flex gap-3">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => handleRejectTrade(request.id)}
                                      className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    >
                                      拒绝
                                    </Button>
                                    <Button 
                                      onClick={() => handleAcceptTrade(request.id, request)}
                                      className="rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                                    >
                                      接受交易
                                    </Button>
                                  </div>
                                )}
                                {user?.id === request.buyer_id && request.status === 'pending' && (
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleCancelTradeRequest(request.id)}
                                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                                  >
                                    取消请求
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : activeTab === 'addresses' ? (
              <TabsContent value="addresses" forceMount={true} key="addresses" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <CardTitle className="text-2xl font-black flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-green-500" />
                        收货地址
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                          <div key={address.id} className={`border-2 rounded-[1.5rem] p-6 relative group transition-all duration-300 ${
                            address.is_default ? 'border-green-500 bg-green-50/30 dark:bg-green-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-green-200 dark:hover:border-green-800'
                          }`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                  {address.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{address.name}</h3>
                                  {address.is_default && (
                                    <span className="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded-full font-bold">默认地址</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-slate-400 hover:text-green-600 hover:bg-green-50"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 pl-13">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="font-mono">{address.phone}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                <span className="leading-relaxed">{address.address}</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {isAddingAddress ? (
                          <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-[1.5rem] p-6 bg-green-50/20 dark:bg-green-900/5">
                            <h4 className="font-bold mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              新地址
                            </h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>收件人</Label>
                                  <Input 
                                    value={newAddress.name} 
                                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                                    placeholder="姓名"
                                    className="rounded-xl"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>手机号</Label>
                                  <Input 
                                    value={newAddress.phone} 
                                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                    placeholder="手机号"
                                    className="rounded-xl"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>详细地址</Label>
                                <Input 
                                  value={newAddress.address} 
                                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                  placeholder="省市区街道门牌号"
                                  className="rounded-xl"
                                />
                              </div>
                              <div className="flex gap-3 pt-2">
                                <Button onClick={handleAddAddress} className="flex-1 rounded-xl bg-green-500 hover:bg-green-600">保存</Button>
                                <Button variant="outline" onClick={() => setIsAddingAddress(false)} className="flex-1 rounded-xl">取消</Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="h-full min-h-[180px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-green-600 hover:border-green-400 hover:bg-green-50/30 transition-all group"
                            onClick={() => setIsAddingAddress(true)}
                          >
                            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 flex items-center justify-center transition-colors">
                              <Plus className="h-6 w-6" />
                            </div>
                            <span className="font-bold">添加新地址</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : activeTab === 'settings' ? (
              <TabsContent value="settings" forceMount={true} key="settings" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <CardTitle className="text-2xl font-black flex items-center gap-2">
                        <Settings className="h-6 w-6 text-green-500" />
                        个人设置
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg text-slate-400 uppercase tracking-wider text-xs pl-2">个人资料</h3>
                          
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                                {avatarUrl ? (
                                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xl font-black text-slate-400">
                                    {(username || user.email)?.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">头像</h4>
                                <p className="text-sm text-slate-500">支持 JPG, PNG 格式</p>
                              </div>
                            </div>
                            <label htmlFor="avatar-upload-settings" className="cursor-pointer">
                              <div className="px-4 py-2 rounded-full bg-green-50 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors border border-green-100">
                                {uploading ? '上传中...' : '更换'}
                              </div>
                              <input
                                type="file"
                                id="avatar-upload-settings"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                              />
                            </label>
                          </div>

                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <span className="text-xl font-black text-slate-400">
                                  {(username || user.email)?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">署名</h4>
                                <p className="text-sm text-slate-500">{username || '未设置'}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="px-4 py-2 rounded-full bg-green-50 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors border border-green-100"
                              onClick={() => setIsChangeUsernameModalOpen(true)}
                            >
                              更换
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-bold text-lg text-slate-400 uppercase tracking-wider text-xs pl-2">账户信息</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <Label className="text-slate-500 text-xs font-bold mb-1 block">邮箱</Label>
                              <div className="font-bold text-lg text-slate-800 dark:text-slate-200">{user.email}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <Label className="text-slate-500 text-xs font-bold mb-1 block">用户ID</Label>
                              <div className="font-mono text-sm text-slate-600 dark:text-slate-400 pt-1">{user.id}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg text-slate-400 uppercase tracking-wider text-xs pl-2">安全设置</h3>
                          <div 
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:border-green-300 hover:shadow-md transition-all group"
                            onClick={() => setIsChangePasswordModalOpen(true)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                <Shield className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">修改密码</h4>
                                <p className="text-sm text-slate-500">定期修改密码以保护账号安全</p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg text-slate-400 uppercase tracking-wider text-xs pl-2">关于</h3>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-[2rem] text-center">
                            <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mb-3">
                              <span className="text-2xl">🌱</span>
                            </div>
                            <h4 className="font-black text-xl text-green-800 dark:text-green-300">绿色生活</h4>
                            <p className="text-green-600 dark:text-green-400 font-bold mb-4">v1.0.0</p>
                            <p className="text-sm text-green-700/70 dark:text-green-300/70 max-w-md mx-auto">
                              感谢您使用绿色生活应用，让我们一起为地球环保贡献一份力量。
                            </p>
                          </div>
                        </div>

                         <Button 
                          variant="outline" 
                          className="w-full h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                          onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.reload();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          退出登录
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : null}
          </AnimatePresence>
        </Tabs>

        {/* 结算模态框 */}
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 backdrop-blur-md z-10">
                <h3 className="text-xl font-black">确认订单</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setIsCheckoutModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* 收货地址 */}
                <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-500" />
                    收货地址
                  </h4>
                  {addresses.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-900/50">
                      <p className="text-slate-500 mb-4 font-bold">暂无收货地址</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCheckoutModalOpen(false);
                          setActiveTab('addresses');
                          setIsAddingAddress(true);
                        }}
                        className="rounded-full border-2"
                      >
                        添加地址
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${selectedAddress?.id === address.id ? 'border-green-500 bg-green-50/50 shadow-md ring-2 ring-green-200' : 'border-slate-200 dark:border-slate-800 hover:border-green-200'}`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-bold">{address.name}</h5>
                                {address.is_default && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-green-500 text-white rounded-full">默认</span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{address.phone}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{address.address}</p>
                            </div>
                            {selectedAddress?.id === address.id && (
                              <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-100" />
                            )}
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="h-full min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-green-600 hover:border-green-400"
                        onClick={() => {
                          setIsCheckoutModalOpen(false);
                          setActiveTab('addresses');
                          setIsAddingAddress(true);
                        }}
                      >
                        <Plus className="h-5 w-5" />
                        <span>添加新地址</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* 支付方式 */}
                <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-500" />
                    支付方式
                  </h4>
                  <div className="flex gap-4">
                    <div 
                      className={`flex-1 border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3 ${selectedPayment === 'alipay' ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-slate-200 dark:border-slate-800'}`}
                      onClick={() => setSelectedPayment('alipay')}
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                        支
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">支付宝</span>
                      {selectedPayment === 'alipay' && <CheckCircle2 className="ml-auto h-5 w-5 text-blue-500" />}
                    </div>
                    <div 
                      className={`flex-1 border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3 ${selectedPayment === 'wechat' ? 'border-green-500 bg-green-50/50 shadow-md' : 'border-slate-200 dark:border-slate-800'}`}
                      onClick={() => setSelectedPayment('wechat')}
                    >
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                        微
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">微信支付</span>
                      {selectedPayment === 'wechat' && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                    </div>
                  </div>
                </div>
                
                {/* 订单商品 */}
                <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-500" />
                    商品信息
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 space-y-4">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm line-clamp-1">{item.title}</h5>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-green-600 font-bold">¥{typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price}</span>
                            <span className="text-slate-500 text-sm">×{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 订单金额 */}
                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">商品总价</span>
                      <span className="font-bold">¥{checkoutItems.reduce((total, item) => {
                        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price;
                        return total + price * item.quantity;
                      }, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">运费</span>
                      <span className="font-bold text-green-600">免运费</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                      <span className="font-bold text-lg">实付金额</span>
                      <span className="text-3xl font-black text-green-600">¥{checkoutItems.reduce((total, item) => {
                        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('¥', '')) : item.price;
                        return total + price * item.quantity;
                      }, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md sticky bottom-0 z-10">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="rounded-full px-8 h-12 font-bold border-2"
                >
                  取消
                </Button>
                <Button 
                  onClick={handleConfirmCheckout}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-full px-8 h-12 shadow-lg shadow-green-500/20"
                >
                  确认支付
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 修改密码模态框 */}
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-black">修改密码</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">当前密码</Label>
                    <Input 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="请输入当前密码"
                      className="rounded-xl h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-bold">新密码</Label>
                    <Input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="请输入新密码"
                      className="rounded-xl h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-bold">确认新密码</Label>
                    <Input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="请再次输入新密码"
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 font-bold"
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    // 重置表单
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleChangePassword} className="rounded-full px-6 font-bold bg-green-500 hover:bg-green-600 text-white">确认修改</Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 修改署名模态框 */}
        {isChangeUsernameModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-black">修改署名</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setIsChangeUsernameModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">新署名</Label>
                    <Input 
                      type="text" 
                      value={newUsername} 
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="请输入新署名"
                      className="rounded-xl h-12"
                      maxLength={20}
                    />
                    <p className="text-xs text-slate-500">署名长度为 3-20 个字符，且不能与其他用户重复。</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 font-bold"
                  onClick={() => {
                    setIsChangeUsernameModalOpen(false);
                    setNewUsername(username || '');
                  }}
                  disabled={updatingUsername}
                >
                  取消
                </Button>
                <Button 
                  onClick={handleUpdateUsername} 
                  className="rounded-full px-6 font-bold bg-green-500 hover:bg-green-600 text-white min-w-[100px]"
                  disabled={updatingUsername}
                >
                  {updatingUsername ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : '确认修改'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
