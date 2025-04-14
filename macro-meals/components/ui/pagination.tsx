import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "./button";

export interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  pageIndex,
  totalCount,
  perPage,
  onPageChange,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1;

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pages - 1;

  return (
    <div className="flex items-center justify-between mt-4 mb-4">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} item(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-normal">
          Página {pageIndex + 1} de {pages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(0)}
            disabled={isFirstPage}
          >
            <ChevronsLeft />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
            disabled={isFirstPage}
          >
            <ChevronLeft />
            <span className="sr-only">Página Anterior</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(Math.min(pageIndex + 1, pages - 1))}
            disabled={isLastPage}
          >
            <ChevronRight />
            <span className="sr-only">Próxima página</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pages - 1)}
            disabled={isLastPage}
          >
            <ChevronsRight />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
