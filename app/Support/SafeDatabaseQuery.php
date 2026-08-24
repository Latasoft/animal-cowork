<?php

namespace App\Support;

use Closure;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use PDOException;

class SafeDatabaseQuery
{
    /**
     * @template TValue
     *
     * @param  Closure(): TValue  $callback
     * @param  TValue  $fallback
     * @param  class-string  $model
     * @return DatabaseQueryResult<TValue>
     */
    public function run(
        Closure $callback,
        mixed $fallback,
        string $component,
        string $model,
        string $operation,
    ): DatabaseQueryResult {
        try {
            return DatabaseQueryResult::available($callback());
        } catch (QueryException|PDOException $exception) {
            Log::error('Database operation unavailable.', [
                'component' => $component,
                'model' => $model,
                'operation' => $operation,
                'route' => request()->route()?->getName(),
                'exception' => $exception,
            ]);

            return DatabaseQueryResult::unavailable($fallback);
        }
    }
}
