import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from "axios";


// A component to render code blocks with syntax highlighting
// const CodeBlock = ({ language, value }) => {
//   return (
//     <SyntaxHighlighter language={language || null} style={docco}>
//       {value}
//     </SyntaxHighlighter>
//   );
// };

// Main component to render the chatbot response
const ChatbotResponse = ({ response }) => {
  return (
    <div>
      <ReactMarkdown
        children={response}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={a11yDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      />
    </div>
  );
};

export default ChatbotResponse;