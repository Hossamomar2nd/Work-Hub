import io from "socket.io-client";

const URL = "http://127.0.0.1:3000";

const socket = io(URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
});

export default socket;
