enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

interface Sort {
  name: string;
  direction: SortDirection;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sorts: Sort[];
}

export {
  SortDirection,
  Sort,
  Pageable,
};
