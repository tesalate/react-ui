import React, { useState, useMemo } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Table, Button, Form, Row, Col, FormControl, Alert, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import useDeepCompareEffect from 'use-deep-compare-effect';
import ThemedSkeleton from '../ThemedSkeleton/ThemedSkeleton';
import { range } from 'lodash';

const MasterTable = ({ data, columns, loading, actions, pageSizeFromState, pageIndexFromState, sortBy, error = false, style = {}, totalPages = 0 }: any) => {
  const dispatch = useDispatch();
  const [one, two] = useState(true);

  const {
    uiState: { theme },
  } = useSelector(({ uiState }: RootState) => ({
    uiState: {
      theme: uiState.theme,
    },
  }));

  const styles: React.CSSProperties = {
    ...style,
    borderRadius: '.6rem',
    border: 'var(--main-border-style)',
    overflowY: 'scroll',
    marginBottom: '.5rem',
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    // pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex /*pageSize */ },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: pageIndexFromState, pageSize: pageSizeFromState, sortBy: sortBy },
      pageCount: totalPages,
      manualPagination: true,
    },
    useSortBy,
    usePagination
  );

  // useDeepCompareEffect(()=> {
  //   page.forEach(item => {
  //     if (!sessionData[item.values._id]){
  //       dispatch(actions.requestSessionById(currentVehicles, item.values._id))
  //     }
  //   })
  // },[dispatch, page])

  const loadingCells = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => (
        <tr key={i}>
          {Array.from({ length: 7 }, (_, ii) => (
            <td key={ii}>
              <ThemedSkeleton />
            </td>
          ))}
        </tr>
      )),
    []
  );

  useDeepCompareEffect(() => {
    dispatch(actions.setSort(headerGroups[0].headers));
  }, [dispatch, one]);

  const showSpinner = useMemo(() => loading && data.length > 0, [loading, data]);

  return (
    <div style={{ position: 'relative', marginTop: '-25px' }}>
      <span style={{ position: 'absolute', top: '-10px', right: '10px', minHeight: '25px', display: showSpinner ? '' : 'none' }}>
        <small className="text-muted me-2">loading</small>
        <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" />
      </span>
      <br />
      <div style={{ ...styles }}>
        <Table {...getTableProps()} striped responsive variant={theme ?? undefined} className={'mb-0'}>
          <thead style={{ borderRadius: '.6rem .6rem 0px 0px' }}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} onClick={() => two(!one)}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>{column.isSorted ? column.isSortedDesc ? <i className="arrow down ms-2"></i> : <i className="arrow up ms-2"></i> : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {error ? (
              <Alert variant={'danger'} className="w-100 mb-0">
                <span role="img" aria-label="warning" className="me-2">
                  ⚠️
                </span>
                error loading data
              </Alert>
            ) : loading && page.length === 0 ? (
              loadingCells
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className={row.values['sessionData.supercharger.value'] ? '' : ''}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
      <Row>
        <Col xs={8} sm={10} md={10} className="pe-0 d-flex align-items-center">
          <Button
            className="me-1"
            variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
            size="sm"
            onClick={() => {
              dispatch(actions.setPageOption('pageIndex', 0));
              return gotoPage(0);
            }}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </Button>{' '}
          <Button
            className="me-1"
            variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
            size="sm"
            onClick={() => {
              dispatch(actions.setPageOption('pageIndex', pageIndex - 1));
              return previousPage();
            }}
            disabled={!canPreviousPage}
          >
            {'<'}
          </Button>{' '}
          <Button
            className="me-1"
            variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
            size="sm"
            onClick={() => {
              dispatch(actions.setPageOption('pageIndex', pageIndex + 1));
              return nextPage();
            }}
            disabled={!canNextPage}
          >
            {'>'}
          </Button>{' '}
          <Button
            className="me-1"
            variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
            size="sm"
            onClick={() => {
              dispatch(actions.setPageOption('pageIndex', pageCount - 1));
              return gotoPage(pageCount - 1);
            }}
            disabled={!canNextPage}
          >
            {'>>'}
          </Button>{' '}
          <Button className="me-1" disabled variant={theme === 'light' ? 'outline-dark' : 'outline-light'} size="sm">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageCount}
            </strong>{' '}
          </Button>
        </Col>
        {/* <span>
          Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
              dispatch(actions.setPageOption('pageIndex', page))
            }}
            style={{ width: "100px" }}
          />
        </span> */}
        <Col xs={4} sm={2} md={2} className="ps-0">
          <Form style={{ maxWidth: '120px' }} className="mt-1 mb-0 float-end">
            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="mb-1">
              <FormControl
                as="select"
                size="sm"
                value={pageSizeFromState}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setPageSize(Number(num));
                  dispatch(actions.setPageOption('pageSize', num));
                }}
              >
                {range(2, 102, 2).map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} rows
                  </option>
                ))}
              </FormControl>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default MasterTable;
