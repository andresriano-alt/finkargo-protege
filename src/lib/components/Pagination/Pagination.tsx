import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { primary, secondary, gray } from '../../tokens';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  className?: string;
}

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
});

const PageSizeWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const PageSizeLabel = styled('span')({
  fontFamily: '"Albert Sans", sans-serif',
  fontSize: '14px',
  color: primary.dark,
  whiteSpace: 'nowrap',
});

const PageSizeSelect = styled('select')({
  fontFamily: '"Albert Sans", sans-serif',
  fontSize: '14px',
  color: primary.dark,
  border: `1px solid ${gray[200]}`,
  borderRadius: '6px',
  padding: '0 12px',
  height: '32px',
  width: '70px',
  background: gray.white,
  cursor: 'pointer',
  outline: 'none',
  '&:focus': {
    borderColor: secondary.main,
    boxShadow: '0 0 0 2px rgba(60,71,211,0.15)',
  },
});

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageSize = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  totalItems,
  className,
}) => (
  <Container className={className}>
    {showPageSize && (
      <PageSizeWrapper>
        <PageSizeLabel>
          {totalItems !== undefined ? `${totalItems} registros` : 'Filas:'}
        </PageSizeLabel>
        <PageSizeSelect
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </PageSizeSelect>
      </PageSizeWrapper>
    )}
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={(_, page) => onPageChange(page)}
    />
  </Container>
);

export default Pagination;
