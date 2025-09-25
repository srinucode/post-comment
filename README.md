# Post-Comment Microservices Monorepo

A Node.js monorepo for managing **posts** and **comments**, built with **Express**, **MongoDB**, **RabbitMQ**, and documented with **Swagger**.  

This repository contains two microservices:

1. **Post Service** – Manages posts (create, read, delete)  
2. **Comment Service** – Manages comments (create, reply, fetch)  

Both services communicate via **RabbitMQ** events.  

---

## Table of Contents
- [Project Overview](#project-overview)  
- [Tech Stack](#tech-stack)  
- [Services](#services)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [RabbitMQ Installation & Startup](#rabbitmq-installation--startup)  
---

## Project Overview

- **Microservice Architecture**: Each service is independent and communicates via RabbitMQ events.  
- **Event-driven**: Post creation/deletion events are published for comment service or other subscribers.  
- **Swagger Documentation**: Each service has its own Swagger UI for API exploration.  

---

## Tech Stack

- Node.js & Express  
- MongoDB & Mongoose  
- RabbitMQ  
- Swagger / OpenAPI  
- TypeScript  
- JWT Authentication  

---

## Services

### 1. Post Service

- **Base URL:** `/posts`  
- **Features:**
  - Create, read, delete posts  
  - Delete all posts by a user  
- **Events Published:** `POST_CREATED`, `POST_DELETED`  
- **Swagger Docs:** `http://localhost:<POST_SERVICE_PORT>/api-docs`  

### 2. Comment Service

- **Base URL:** `/comments`  
- **Features:**
  - Create comments and replies  
  - Fetch comments for a post  
  - Listen to post events to remove comments on deleted posts  
- **Events Subscribed:** `POST_CREATED`, `POST_DELETED`  
- **Swagger Docs:** `http://localhost:<COMMENT_SERVICE_PORT>/api-docs`  

---

## Getting Started

### Prerequisites

- Node.js v20+  
- MongoDB  
- RabbitMQ  

### Installation

```bash
# Clone the repository
git clone https://github.com/srinucode/post-comment.git
cd post-comment

# Install dependencies for Post Service
cd services/post-service
npm install

# Install dependencies for Comment Service
cd ../comment-service
npm install

# Run Post Service
cd services/post-service
npm run dev

# Run Comment Service
cd ../comment-service
npm run dev


##Environment Variables

# MongoDB
MONGO_URI=mongodb://localhost:27017/postcomment (you need to set your mongodb url in .env file )




# RabbitMq setup
sudo apt-get update
sudo apt-get install rabbitmq-server -y
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server


