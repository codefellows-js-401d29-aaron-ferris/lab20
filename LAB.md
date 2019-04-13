# LAB: Socket.io - Message Queue Server

## Before you begin
Refer to *Getting Started* in [lab-instructions.md](../../../reference/submission-instructions/labs.md) for complete setup instructions

## Getting Started

Get your api server up and running!  You're going to be modifying it in this lab.

You will likely be creating 3 new git repositories to house the servers for this lab assignment

## Overview

For this lab assignment, we will be writing a Message Queue server that monitors database events, and then modifying our API server to fire events into that Queue on all CRUD operations in our models.

### Assignment - Message Queue Server and Logger

[x] Create a message queue server
[x] Initiate a queue called "files" that monitors "save" and "error" events
[x] Initiate a queue called "database" that monitors "create", "read", "update", "delete" and "error" events
[x] Create a logger application 
[x] Connects to the "file" and "database" queues
[x] Performs a custom `console.log()` on the events named above

### Assignment 1 - File Writer (warm-up)
This will be a repeat of the previous labs, this time using your new message queue server.

[x] In the starter code, you'll once again find an `app.js` that reads and modifies a file.
[x] On a successful write, publish a "save" event to the "file" queue
[x] On error, publish an "error" event to the "file" queue
[x] Modularize the file reader

### Assignment 2 - API Server
Alter your API server to publish events on all CRUD Operations

* Import the Queue client library
* Perform a publish into the database queue, after "create", "update", "delete" and on any errors in your models.

**Questions**

* Where is the best place to do this? In the `mongo.js`? In each mongoose model?
* How will you trap and publish error events?
* Where will you identify the Queue server?

### Testing
* What will your approach be to asserting the API server published the right event?
* How will you write assertions on the logger?

### Deployment
* Deploy all 3 servers (server, logger, api server) to Heroku.  Use `heroku logs` to view your logger output as your API is serving requests.
* Do not deploy the file writer app. Theres' no server running for that


### Assignemnt Submission Instructions
Refer to the [lab-instructions.md](../../../reference/submission-instructions/labs.md) for the complete lab submission process and expectations
