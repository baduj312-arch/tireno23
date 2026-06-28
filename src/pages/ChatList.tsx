import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Header from '../components/Header';

const chats = [
  {
    id: '1',
    name: 'Kwame Osei',
    avatar: 'KO',
    lastMessage: 'I\'m on my way. ETA 4 minutes.',
    time: '10:37 AM',
    unread: 1,
    online: true,
  },
  {
    id: '2',
    name: 'Ama Mensah',
    avatar: 'AM',
    lastMessage: 'Thanks for the ride!',
    time: 'Jun 24',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Yaw Addo',
    avatar: 'YA',
    lastMessage: 'Payment received. Have a great day!',
    time: 'Jun 20',
    unread: 0,
    online: true,
  },
];

export default function ChatList() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Header title="Messages" />
      <div className="p-4 pb-6">
        <div className="space-y-2">
          {chats.map((chat, i) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="w-full card-dark p-4 flex items-center gap-3 text-left"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-tireno-surfaceLight flex items-center justify-center text-white font-bold text-sm">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-tireno-green rounded-full border-2 border-tireno-surface" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium text-sm">{chat.name}</p>
                  <span className="text-tireno-gray text-xs">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-tireno-gray text-xs truncate pr-2">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-tireno-orange text-white text-xs flex items-center justify-center font-medium">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={18} className="text-tireno-gray shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
