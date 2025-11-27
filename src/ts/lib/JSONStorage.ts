import { ISival } from "../types/lib.types"

export interface JsonStoreData {
  id: string
  data: ISival
}

export class JSONStore {
  private readonly dbName: string
  private readonly storeName: string
  private readonly dbVersion: number

  constructor(dbName: string, storeName: string, dbVersion: number = 1) {
    this.dbName = dbName
    this.storeName = storeName
    this.dbVersion = dbVersion
  }

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error("Browser is not supported"))
      }

      const request = window.indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (_event) => {
        reject(new Error(`Failed opening: ${request.error?.message}`))
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" })
        }
      }

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result)
      }
    })
  }

  public async save(data: JsonStoreData): Promise<void> {
    const db = await this.openDb()

    const transaction = db.transaction([this.storeName], "readwrite")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.put(data)

      request.onsuccess = () => {}

      transaction.oncomplete = () => {
        db.close()
        resolve()
      }

      transaction.onerror = (_event) => {
        db.close()
        reject(new Error(`Failed saving: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Failed saving: ${request.error?.message}`))
      }
    })
  }

  public async getAll(): Promise<string[] | null> {
    const db = await this.openDb()

    const transaction = db.transaction([this.storeName], "readonly")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys()

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result as string[] | undefined
        db.close()

        resolve(result || null)
      }

      transaction.onerror = (_event) => {
        db.close()
        reject(new Error(`Failed loading: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Failed loading: ${request.error?.message}`))
      }
    })
  }

  public async load(id: string): Promise<JsonStoreData | null> {
    const db = await this.openDb()

    const transaction = db.transaction([this.storeName], "readonly")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.get(id)

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result as JsonStoreData | undefined
        db.close()
        resolve(result || null)
      }

      transaction.onerror = (_event) => {
        db.close()
        reject(new Error(`Failed loading: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Failed loading: ${request.error?.message}`))
      }
    })
  }

  public async delete(id: string): Promise<void> {
    const db = await this.openDb()

    const transaction = db.transaction([this.storeName], "readwrite")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(id)

      request.onsuccess = () => {}

      transaction.oncomplete = () => {
        db.close()
        resolve()
      }

      transaction.onerror = (_event) => {
        db.close()
        reject(new Error(`Failed deleting: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Failed deleting: ${request.error?.message}`))
      }
    })
  }

  public deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error("Browser is not supported."))
      }

      const request = window.indexedDB.deleteDatabase(this.dbName)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = (_event) => {
        reject(new Error(`Failed deleting: ${request.error?.message}`))
      }
    })
  }
}
