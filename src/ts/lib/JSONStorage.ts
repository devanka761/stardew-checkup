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
        reject(new Error(`Failed opening db: ${request.error?.message}`))
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" })
          console.log(`Object Store '${this.storeName}' dibuat.`)
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

      request.onsuccess = () => {
        console.log(`Data dengan ID '${data.id}' berhasil disimpan.`)
      }

      transaction.oncomplete = () => {
        db.close()
        resolve()
      }

      transaction.onerror = (_event) => {
        db.close()
        reject(new Error(`Save transaction failed: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Put operation failed: ${request.error?.message}`))
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
        reject(new Error(`Load failed: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Get operation failed: ${request.error?.message}`))
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
        reject(new Error(`Load failed: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Get operation failed: ${request.error?.message}`))
      }
    })
  }

  public async delete(id: string): Promise<void> {
    const db = await this.openDb()

    const transaction = db.transaction([this.storeName], "readwrite")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log(`Data dengan ID '${id}' berhasil dihapus.`)
      }

      transaction.oncomplete = () => {
        db.close()
        resolve()
      }

      transaction.onerror = (_event) => {
        db.close()
        reject(new Error(`Transaksi penghapusan gagal: ${transaction.error?.message}`))
      }

      request.onerror = (_event) => {
        reject(new Error(`Operasi delete gagal: ${request.error?.message}`))
      }
    })
  }

  public deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error("IndexedDB tidak didukung."))
      }

      const request = window.indexedDB.deleteDatabase(this.dbName)

      request.onsuccess = () => {
        console.log(`Database '${this.dbName}' berhasil dihapus.`)
        resolve()
      }

      request.onerror = (_event) => {
        reject(new Error(`Gagal menghapus DB: ${request.error?.message}`))
      }
    })
  }
}
