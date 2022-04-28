import pg, { Pool, PoolClient } from "pg";

export class LazyTransactionalClientPG {
    private _pool: Pool;
    private _client?: PoolClient;
    private _begined: boolean;
    private _failedOnQuery: boolean;

    constructor(pool: Pool) {
        this._pool = pool;
        this._client = undefined;
        this._begined = false;
        this._failedOnQuery = false;
    }

    async query(
        queryString: string,
        args?: any[]
    ): Promise<pg.QueryResult<any>> {
        /**
         * Start connection if not connected
         */
        if (this._client == undefined) {
            try {
                this._client = await this._pool.connect();
            } catch (error) {
                throw error; // erro ao adquirir conexão
            }
        }

        /**
         * Start transaction if not started
         */
        try {
            await this._client.query("BEGIN");
            this._begined = true;
        } catch (error) {
            throw error;
        }

        try {
            return this._client.query(queryString, args);
        } catch (error) {
            this._failedOnQuery = true;
            throw error;
        }
    }

    async close(): Promise<void> {
        //closed
        if (!this._client) {
            this._client = undefined;
            this._begined = false;
            this._failedOnQuery = false;
            return;
        }

        //transaction not started
        if (!this._begined) {
            this._client.release();
            this._client = undefined;
            this._begined = false;
            this._failedOnQuery = false;
            return;
        }

        //failed
        if (this._failedOnQuery) {
            try {
                await this._client.query("ROLLBACK");
            } catch (error) {
                throw error;
            } finally {
                this._client.release();
                this._client = undefined;
                this._begined = false;
                this._failedOnQuery = false;
                return;
            }
        }

        try {
            await this._client.query("COMMIT");
        } catch (error) {
            try {
                await this._client.query("ROLLBACK");
            } catch (error) {
                throw error;
            }
        } finally {
            this._client.release();
            this._client = undefined;
            this._begined = false;
            this._failedOnQuery = false;
            return;
        }
    }
}
