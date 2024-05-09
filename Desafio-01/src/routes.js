import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

const newDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: newDate,
        updated_at: newDate
      }

      database.insert('tasks', tasks)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const data = database.update('tasks', id, {
        title,
        description,
      })

      if (data === 'error') {
        return res.writeHead(405, 'Task not found').end()
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const data = database.patch('tasks', id)

      if (data === 'error') {
        return res.writeHead(405, 'Task not found').end()
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const data = database.delete('tasks', id)

      if (data === 'error') {
        return res.writeHead(405, 'Task not found').end()
      }

      return res.writeHead(204).end()
    }
  }
]