import React, { useState, useEffect } from 'react';
import "./Chatbot.scss";
import { Link, useParams } from 'react-router-dom';
import socket from '../../connection/socket.js';
import { getAuthUser } from '../../localStorage/storage';
import ChatbotResponse from './chatResponseHandler.jsx';
import axios from "axios";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [conversationMessages, setConversationMessages] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    });

    const user = getAuthUser();
    let { id } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isThinking) {
            return;
        }
        axios.post("http://localhost:3000/api/chatbotMessages/addMessage", {
            conversationId: id,
            senderType: "user",
            message: message
        }).then((resp) => {
            console.log(resp);
            document.getElementById("chabotFrom").reset();  
            setConversationMessages({ reload: conversationMessages.reload + 1 });

            var elem = document.getElementById("chatScroll");
            elem.scrollBy(0, 8000);

        }).catch((err) => {
            console.log(err);
        });

        socket.emit("message", message);
        setIsThinking(true);
        var elem = document.getElementById("chatScroll");
        elem.scrollBy(0, 9000);
    }

    useEffect(() => {
        axios.get("http://localhost:3000/api/chatbotMessages/getMessagesByConversationId/" + id)
        .then((resp) => {
            console.log(resp.data.messagesData);
            setConversationMessages({ results: resp.data.messagesData });
            console.log(conversationMessages.results);

            var elem = document.getElementById("chatScroll");
            elem.scrollBy(0, elem.scrollHeight);
            window.scrollTo(0, 200);

        }).catch((err) => {
            console.log(err);
        });
    }, [conversationMessages.reload]);

    useEffect(() => {
        const handleSocketResponse = (response) => {

            axios.post("http://localhost:3000/api/chatbotMessages/addMessage", {
                conversationId: id,
                senderType: "chatbot",
                message: response
            }).then((resp) => {
                console.log(resp);
                setIsThinking(false);
                setConversationMessages({ reload: conversationMessages.reload + 1 });

                // window.location = "http://localhost:3001/chatbot/" + id;
                var elem = document.getElementById("chatScroll");
                elem.scrollBy(0, 8000);
            }).catch((err) => {
                console.log(err);
            });

        };

        socket.on("response", handleSocketResponse);

        return () => {
            socket.off("response", handleSocketResponse);
        };
    }, [id, responseMessage]);

    return (
        <>
            <form id='chabotFrom' onSubmit={handleSubmit}>
                <div className="message">
                    <span className="messageTitle">
                        <Link className="messagePath" reloadDocument to="/userDashboard">Dashboard</Link> {'>'} Chatbot
                    </span>
                    <div className="chatPage">
                        <div id="chatScroll" className="messageContainer">
                            <div className="messages">
                                {/* {message && (
                                    <div className="item owner">
                                        <Link reloadDocument to={"/profile/" + user._id}>
                                            <img src={user.image_url} alt="User" />
                                        </Link>
                                        <p>{message}</p>
                                    </div>
                                )}
                                <div className="item">
                                    <img src="../img/chatbot1.png" alt="Chatbot" />
                                    <div className='chatbotMessage'>
                                        {isThinking ? (
                                            <p>Thinking...</p>
                                        ) : (
                                            <p><ChatbotResponse response={responseMessage} /></p>
                                        )}
                                    </div>
                                </div> */}



                                {
                         conversationMessages.err == null && conversationMessages.results && conversationMessages.results.length > 0 && (
                            conversationMessages.results.map((message) => (
                            <>
                                <div className={message.senderType == "user" ? "item owner" : "item"}>
                                <Link reloadDocument to={message.senderType == "user" ? "/profile/" +  user._id : null}>
                                    <img
                                        src={message.senderType == "user" ? user.image_url : "../img/chatbot1.png"}
                                    />
                                </Link>
                                {message.senderType == "user" ? 
                                <p>
                                    {message.senderMessage}
                                </p>
                                :
                                <p>
                                    <ChatbotResponse response={message.senderMessage} />
                                </p>
                                }
                                </div>
                            </>
                            ))
                        )
                    }
                                {isThinking ? (
                                            <p className='thinkingText'>Thinking...</p>
                                        ) : (
                                            null
                                    )}




                            </div>
                        </div>


                        <hr />
                        <div className="sendContainer">
                            <div className="write">
                                <textarea required placeholder='Message our Chatbot' type="text" onChange={(e) => setMessage(e.target.value)} />
                            </div>
                            <>
                                <button type="submit" className="sendButtonChatbot"><img src="../img/uploading.png" alt="" /></button>
                            </>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Chatbot;
