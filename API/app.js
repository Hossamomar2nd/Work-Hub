import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { DBconnection } from './DB/connection.js';
import { Server } from "socket.io";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import path from "path";
import { fileURLToPath } from "url";
import freelancersRoutes from './src/modules/freelancer/freelancer_routes.js'
import adminRoutes from './src/modules/admin/admin_routes.js'
import categoriesRoute from './src/modules/categories/categoriesRoutes.js'
import clientsRoute from './src/modules/clients/clientsRoutes.js'
import ordersRoute from './src/modules/orders/ordersRoutes.js'
import requestsRoute from './src/modules/requests/requestsRoutes.js'
import communitiesRoutes from './src/modules/communities/communitiesRoutes.js'
import conversationsRoutes from './src/modules/conversations/conversationsRoutes.js'
import messagesRoutes from './src/modules/messages/messagesRoutes.js'
import postsRoutes from './src/modules/posts/post_routes.js'
import professorsRoutes from './src/modules/professors/professorsRoutes.js'
import authRoutes from './src/modules/auth/authRoutes.js'
import servicesRoutes from './src/modules/service/service.router.js'
import reviewsRoutes from './src/modules/reviews/reviewRouter.js'
import coursesRoutes from './src/modules/courses/coursesRoutes.js'
import chatbotConversationRoutes from './src/modules/chatbotConversation/chatbotConversationRoutes.js'
import chatbotMessagesRoutes from './src/modules/chatbotMessages/chatbotMessagesRoutes.js'


dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());


app.use("/api/categories", categoriesRoute);
app.use("/api/clients", clientsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/requests", requestsRoute);
app.use("/api/freelancers", freelancersRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/communities", communitiesRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/professors", professorsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/chatbotConversations", chatbotConversationRoutes);
app.use("/api/chatbotMessages", chatbotMessagesRoutes);


// app.all("*", (req, res) => {
//     return res.status(404).json({ success: false, message: "Page Not Found !!! :(" });
// });

app.use(express.static('./src/middleware/upload'));

app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res.status(statusCode).json({
        success: false,
        message: error.message,
        stack: error.stack
    });
});

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
    DBconnection();
});
/******************************************************************************************************************/
/******************************************************************************************************************/
/******************************************************************************************************************/
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const model = new LlamaModel({
    modelPath: path.join(__dirname, "model", "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf")
});

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (soc) => {
    const context = new LlamaContext({ model });
    const session = new LlamaChatSession({ context });
    console.log("There is a new connection");
    soc.on("message", async (msg) => {
        const bot_reply = await session.prompt(msg);
        soc.emit("response", bot_reply);
    })
});

// open source large language model