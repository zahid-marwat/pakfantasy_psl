import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../lib/socket';

const ChatWidget = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const initialMessage = useRef({
        author: 'System',
        message: 'Welcome to the PSL Global Chat! Discuss matches here.',
        time: new Date().toLocaleTimeString(),
        isSystem: true
    });
    const socketRef = useRef(null);
    const [messageList, setMessageList] = useState([initialMessage.current]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        const socket = getSocket();
        socketRef.current = socket;

        const handleIncoming = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.emit('join_room', 'global');
        socket.on('global_chat_receive', handleIncoming);

        return () => {
            socket.off('global_chat_receive', handleIncoming);
        };
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !user) {
            return;
        }
        const socket = socketRef.current || getSocket();
            const messageData = {
                room: "global",
                author: user.username,
            message: message.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            await socket.emit("global_chat_message", messageData);
            setMessage("");
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="glass-panel w-80 h-96 rounded-3xl flex flex-col mb-4 overflow-hidden border border-white/10 shadow-[0_20px_45px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="relative p-4 bg-gradient-to-r from-primary to-primary-glow flex justify-between items-center cursor-pointer shadow-inner" onClick={() => setIsOpen(false)}>
                            <h3 className="font-bold text-white flex items-center gap-2 tracking-wide">
                                <span className="w-2 h-2 bg-emerald-200 rounded-full animate-ping"></span>
                                PSL Global Chat
                            </h3>
                            <button className="text-white/80 hover:text-white" aria-label="Close chat">✕</button>
                            <div className="absolute inset-0 bg-white/10 mix-blend-soft-light pointer-events-none"></div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-black/30 via-black/20 to-black/10 custom-scrollbar">
                            {messageList.map((msg, index) => {
                                const isMe = msg.author === user.username;
                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${msg.isSystem ? 'items-center !w-full' : ''}`}
                                    >
                                        {!isMe && !msg.isSystem && (
                                            <span className="text-[10px] text-gray-400 ml-1 mb-1">{msg.author}</span>
                                        )}

                                        {msg.isSystem ? (
                                            <span className="text-xs text-center text-emerald-200/80 bg-emerald-500/10 py-2 px-4 rounded-full border border-emerald-500/20 shadow-inner">{msg.message}</span>
                                        ) : (
                                            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${isMe
                                                    ? 'bg-gradient-to-r from-primary to-primary-glow text-white rounded-br-none shadow-lg shadow-primary/50/20'
                                                    : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                                                }`}>
                                                {msg.message}
                                            </div>
                                        )}

                                        {!msg.isSystem && (
                                            <span className="text-[9px] text-gray-500 mt-1 mx-1">{msg.time}</span>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-3 bg-black/30 border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Cheer for your team..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-primary/30"
                            >
                                ➤
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full shadow-[0_15px_40px_rgba(16,185,129,0.45)] flex items-center justify-center text-2xl text-white border border-white/10 hover:shadow-primary/40"
                >
                    💬
                </motion.button>
            )}
        </div>
    );
};

export default ChatWidget;
