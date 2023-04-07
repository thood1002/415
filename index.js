const express = require('express');
const app = express();
const port = 3001;

// Set the views directory
app.set('views', './views');
app.set('view engine', 'pug');

// Store initial tickets in memory
let tickets = [
  {
    "id": 35436,
    "created_at": "2015-07-20T22:55:29Z",
    "updated_at": "2016-05-05T10:38:52Z",
    "type": "incident",
    "subject": "MFP not working right",
    "description": "PC Load Letter? What does that even mean???",
    "priority": "med",
    "status": "open",
    "recipient": "support_example@selu.edu",
    "submitter": "Michael_bolton@selu.edu",
    "assignee_id": 235323,
    "follower_ids": [235323, 234],
    "tags": ["enterprise", "printers"],
  },
  {
    "id": 35437,
    "created_at": "2015-07-20T23:55:29Z",
    "updated_at": "2016-05-05T11:38:52Z",
    "type": "problem",
    "subject": "Printer out of toner",
    "description": "The printer is out of toner and needs a replacement",
    "priority": "high",
    "status": "open",
    "recipient": "support_example@selu.edu",
    "submitter": "John_smith@selu.edu",
    "assignee_id": 235324,
    "follower_ids": [235324],
    "tags": ["enterprise", "printers"],
  }
];

// Parse request bodies as JSON
app.use(express.json());

// Endpoint to get all tickets
app.get('/rest/list', (req, res) => {
  const formattedTickets = tickets.map((ticket) => {
    const { id, created_at, updated_at, type, subject, description, priority, status, recipient, submitter, assignee_id, follower_ids, tags } = ticket;
    return {
      id,
      created_at,
      updated_at,
      type,
      subject,
      description,
      priority,
      status,
      recipient,
      submitter,
      assignee_id,
      follower_ids,
      tags
    };
  });
  res.json(formattedTickets);
});

// Endpoint to get a single ticket
app.get('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find(ticket => ticket.id === id);
  if (!ticket) {
    res.status(404).json({ message: "Ticket not found" });
  } else {
    res.json(ticket);
  }
});

// Endpoint to create a new ticket
app.post('/rest/ticket', (req, res) => {
  const { type, subject, description, priority, status, submitter, assignee_id, follower_ids, tags } = req.body;

  // Create a new ticket and retrieve its ID
  const ticketId = createNewTicket({
    type,
    subject,
    description,
    priority,
    status,
    submitter,
    assignee_id,
    follower_ids,
    tags,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Retrieve the newly created ticket with its ID
  const ticket = getTicketById(ticketId);

  // Send the ticket ID and the created_at and updated_at timestamps in the response
  res.json({
    id: ticket.id,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
  });
});
function createNewTicket(newTicket) {
  const ticketId = tickets.length + 1;
  tickets.push({
    id: ticketId,
    ...newTicket
  });
  return ticketId;
}
function getTicketById(id) {
  return tickets.find(ticket => ticket.id === id);
}

app.get('/rest/ticket', (req, res) => {
  res.render('ticket');
});

app.listen(port, () => {
  console.log(` ${port}`);
});
