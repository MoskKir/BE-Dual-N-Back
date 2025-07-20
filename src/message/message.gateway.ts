import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';

// const messages = [
//   'Hello, world!',
//   'Welcome to the WebSocket demo!',
//   'Random message here.',
//   'How are you today?',
//   'Another random message!'
// ];

const messages = [
  {
    title: "Using Cards Effectively",
    content: "Cards help separate and structure your content nicely.",
    author: "Carol",
    date: "June 5, 2025",
    tags: ["UX", "design"],
    likes: 21,
  },
  {
    title: "WebSocket Tips",
    content: `Why do we use it?
      It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
      Where does it come from?
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
      Where can I get some?
      There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`,
    author: "Alice",
    date: "July 1, 2025",
    tags: ["websockets", "tips"],
    likes: 15,
  },
  {
    title: "Real-time Features",
    content: "WebSockets enable real-time user interaction.",
    author: "Bob",
    date: "July 10, 2025",
    tags: ["real-time", "features"],
    likes: 34,
  },
  {
    title: "NestJS + WebSockets",
    content: `Where does it come from?
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
      `,
    author: "David",
    date: "July 15, 2025",
    tags: ["NestJS", "WebSocket"],
    likes: 28,
  },
  {
    title: "Efficient Messaging",
    content: "Limit payload size and broadcast wisely.",
    author: "Eve",
    date: "July 18, 2025",
    tags: ["performance", "messages"],
    likes: 12,
  }
];


@WebSocketGateway({ cors: true })
@Injectable()
export class MessageGateway implements OnGatewayInit, OnModuleInit {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  onModuleInit() {
    setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      this.server.emit('newMessage', msg);
    }, 5000);
  }
}