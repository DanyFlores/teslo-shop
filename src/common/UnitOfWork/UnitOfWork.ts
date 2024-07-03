import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export class UnitOfWork {
    private _queryRunner: QueryRunner;
    constructor(
        private _conexion: DataSource
    ) {
    }

    async BeginTransaction(): Promise<QueryRunner> {
        this._queryRunner = this._conexion.createQueryRunner();
        await this._queryRunner.connect();
        await this._queryRunner.startTransaction();
        return this._queryRunner;
    }

    async Commit() {
        try {
            await this._queryRunner.commitTransaction();
        } catch (error) {
            await this.Rollback();
        } finally {
            await this.Dispose();
        }
    }

    async Rollback() {
        try {
            await this._queryRunner.rollbackTransaction();
        } catch (error) {

        } finally {
            await this.Dispose();
        }
    }

    async Dispose() {
        await this._queryRunner.release();
    }

    async GetQueryRunner() {
        return this._queryRunner;
    }
}