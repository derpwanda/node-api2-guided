const knex = require("knex")
const config = require("../knexfile.js")
const db = knex(config.development)

module.exports = {
  find,
  findById,
  add,
  remove,
  update,
  findHubMessages,
  findHubMessageById,
  addHubMessage,
}

function find(query = {}) {
  const { page = 1, limit = 100, sortby = "id", sortdir = "asc" } = query
  const offset = limit * (page - 1)

  //this information can be change by configuring the query string in the API call. See server.get(api/hubs) in index.js

  return db("hubs")
    .orderBy(sortby, sortdir)
    .limit(limit)
    .offset(offset)
    .select()
}

function findById(id) {
  return db("hubs")
    .where({ id })
    .first()
}

async function add(hub) {
  const [id] = await db("hubs").insert(hub)

  return findById(id)
}

function remove(id) {
  return db("hubs")
    .where({ id })
    .del()
}

async function update(id, changes) {
  await db("hubs")
    .where({ id })
    .update(changes)

  return findById(id)
}

function findHubMessages(hubId) {
  return db("messages as m")
    .join("hubs as h", "m.hub_id", "h.id")
    .where({ hub_id: hubId })
    .select(["m.id", "m.text", "m.sender", "h.id as hubId", "h.name as hub"])
}

function findHubMessageById(hubId, id) {
  return db("messages")
    .where({ id, hub_id: hubId })
    .first()
}

async function addHubMessage(hubId, message) {
  const data = { hub_id: hubId, ...message }
  const [id] = await db("messages").insert(data)

  return findHubMessageById(hubId, id)
}
