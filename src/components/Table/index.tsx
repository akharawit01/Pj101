import React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useTable, useFlexLayout } from "react-table";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: "#13265a",
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const cellProps = (props: any, { cell }: { cell: any }) =>
  getStyles(props, cell.column.align);
const headerProps = (props: any, { column }: { column: any }) =>
  getStyles(props, column.align);
const getStyles = (props: any, align = "left") => [
  props,
  {
    style: {
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex",
      fontSize: "16px",
    },
  },
];

const MainTable = ({
  columns,
  data,
  ...rest
}: {
  columns: any[];
  data: object[];
  size?: any;
}) => {
  const tableInstance = useTable({ columns, data }, useFlexLayout);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    // apply the table props
    <Table {...getTableProps()} {...rest}>
      <TableHead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <StyledTableCell {...column.getHeaderProps(headerProps)}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                  </StyledTableCell>
                ))
              }
            </TableRow>
          ))
        }
      </TableHead>
      {/* Apply the table body props */}
      <TableBody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <StyledTableRow {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <StyledTableCell {...cell.getCellProps(cellProps)}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </StyledTableCell>
                    );
                  })
                }
              </StyledTableRow>
            );
          })
        }
      </TableBody>
    </Table>
  );
};

export default MainTable;
