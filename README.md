# HelpDesk Ticket System

This project is a simple **support / ticket system**.  
- Clients can create tickets when they have a problem.  
- Agents can see, update and close these tickets.  
- Both can write comments inside the ticket.

---

## 1. System Overview

The system has three main parts:

- **Client side**  
  - The client creates a new ticket.  
  - The client can see the status of the ticket (open, in progress, closed).  

- **Agent side**  
  - The agent can see all tickets.  
  - The agent can change the status and priority.  
  - The agent can answer the client with comments.

- **Comments view**  
  - Client and agent can write comments inside each ticket.  
  - It is like a small chat for every ticket.

---

## 2. Prerequisites

Before you start, you need:

- **npm** or **yarn**
- **MongoDB**
  - Local: `mongodb://localhost:27017/helpdesk`  
  - Or a cloud database (for example, MongoDB Atlas)

You also need some **environment variables** for:

1. **MongoDB connection**

Create a `.env.local` file in the root of the project with values like:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/helpdesk


```

## How to clone
git clone https://github.com/your-username/helpdesk-ticket-system.git
cd helpdesk-ticket-system

## Install dependencies
npm install

## Start the development server
npm run dev

## Create tickets (client)
![Create Ticket - Client](/public/create-ticket.png)

## Manage Ticket (agent)
![Manage Ticket - Agent](/public/manage-ticket.png)

## Comments view
![Ticket Comments View](/public/comments.png)

## Coder Infromation
- Name: Gabriela Camacho
- Clan: Macondo
- Email: gabrielacacosta31@gmail.com
