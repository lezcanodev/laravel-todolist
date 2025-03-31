<?php

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\ResourceCollection;

class PaginateResource extends ResourceCollection
{
    protected $resourceClass;

    public function __construct($resource, $resourceClass)
    {
        $this->resourceClass = $resourceClass;
        parent::__construct($resource);
    }

    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($item) {
                return new $this->resourceClass($item);
            }),
            'links' => [
                'next' => $this->resource->nextPageUrl(),
                'prev' => $this->resource->previousPageUrl(),
            ],
            'meta' => [
                'totalCount' => $this->resource->total(),
                'totalPage' => $this->resource->lastPage(),
                'currentPage' => $this->resource->currentPage(),
                'pageSize' => $this->resource->perPage(),
            ]
        ];
    }
}