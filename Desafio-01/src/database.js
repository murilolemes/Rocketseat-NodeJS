import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    try {
      const rowIndex = this.#database[table].findIndex(row => row.id === id)

      if (rowIndex <= -1) {
        return error
      }

      const task = this.#database[table][rowIndex]

      const { completed_at, created_at } = task
      const { title, description } = data

      this.#database[table][rowIndex] = {
        id,
        title,
        description,
        completed_at,
        created_at,
        updated_at: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      }
      this.#persist()
    } catch (error) {
      return 'error'
    }
  }

  patch(table, id) {
    try {
      const rowIndex = this.#database[table].findIndex(row => row.id === id)

      console.log(rowIndex)

      if (rowIndex <= -1) {
        return error
      }

      const task = this.#database[table][rowIndex]

      const { title, description, created_at } = task

      this.#database[table][rowIndex] = {
        id,
        title,
        description,
        completed_at: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
        created_at,
        updated_at: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      }
      this.#persist()
    } catch (error) {
      return 'error'
    }
  }

  delete(table, id) {
    try {
      const rowIndex = this.#database[table].findIndex(row => row.id === id)

      if (rowIndex <= -1) {
        return error
      }

      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } catch (error) {
      return 'error'
    }

  }
}