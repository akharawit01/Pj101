import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import { useConfirm } from "material-ui-confirm";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Table } from "components";
import JobEdit from "../JobEdit";
import { StatusChip, JobFilter, InfiniteScroll } from "components";
import { reqJobs, reqDeleteJob } from "services/job";
import { reqJobTypes } from "services/jobType";
import Report from "../Report";
import { find } from "lodash";
import { formatPrice, formatDistanceDatae } from "utils/misc";

type PagiType = {
  total: number;
  lastVisible?: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
    },
  })
);

const JobLists = (props: any) => {
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const confirm = useConfirm();
  const classes = useStyles();
  const [jobTypes, setJobTypes] = React.useState<any[]>([]);
  const [filters, setFilters] = React.useState<object>({});
  const [pagi, setPagi] = React.useState<PagiType>({ total: 0 });

  React.useEffect(() => {
    reqJobs(
      { customerId: props?.customerId, ...filters },
      {
        next: (querySnapshot: any) => {
          setJobs(querySnapshot.items);
          setPagi(querySnapshot.pg);
          setFetching(false);
        },
      }
    );
    return () => {
      setJobs([]);
    };
  }, [props, filters]);

  React.useEffect(() => {
    reqJobTypes().then((resp) => {
      setJobTypes(resp);
    });
  }, []);

  const loadMore = React.useCallback(() => {
    !fetching &&
      pagi.lastVisible &&
      reqJobs(
        { customerId: props?.customerId, last: pagi.lastVisible, ...filters },
        {
          next: (querySnapshot: any) => {
            setJobs((jobs) => [...jobs, ...querySnapshot.items]);
            setPagi(querySnapshot.pg);
          },
        }
      );
  }, [props, filters, pagi.lastVisible, fetching]);

  const handleClick = React.useCallback(
    (id: string) => {
      return confirm().then(() => reqDeleteJob(id));
    },
    [confirm]
  );

  const { customerId } = props;
  const columns = React.useMemo(
    () => [
      {
        Header: "ลูกค้า",
        id: "customerName",
        accessor: (props: any) => {
          const { customer } = props;
          return customerId ? (
            customer.name
          ) : (
            <Link to={`/customer/${customer.id}`}>{customer.name}</Link>
          );
        },
      },
      {
        Header: "ประเภท",
        id: "jobType",
        accessor: (props: any) => {
          return (jobTypes && find(jobTypes, { id: props?.type })?.name) || "-";
        },
        align: "center",
      },
      {
        Header: "จำนวนเงิน (บาท)",
        id: "total",
        accessor: (props: any) => formatPrice(props.total),
        align: "right",
      },
      {
        Header: "เวลา",
        id: "time",
        align: "right",
        accessor: (props: any) => {
          return (
            props.updatedAt?.toDate() &&
            formatDistanceDatae(props.updatedAt?.toDate())
          );
        },
      },
      {
        Header: "สถานะ",
        id: "status",
        accessor: (props: any) => {
          return props.status ? (
            <StatusChip {...props} nextStatus="จ่ายแล้ว" />
          ) : (
            "-"
          );
        },
      },
      {
        Header: "#",
        id: "actions",
        align: "right",
        accessor: (props: any) => {
          return (
            <>
              <JobEdit
                jobData={props}
                handleDelete={() => handleClick(props.id)}
              />
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={() => handleClick(props.id)}
              >
                ลบ
              </Button>
            </>
          );
        },
      },
    ],
    [classes.button, customerId, handleClick, jobTypes]
  );

  return (
    <>
      <Typography variant="h6">ตารางงาน</Typography>

      <Report customerId={customerId} />

      <JobFilter setFilters={setFilters} />

      <TableContainer>
        <InfiniteScroll
          items={jobs}
          fetchData={loadMore}
          hasMore={fetching || pagi.lastVisible}
        >
          <Table columns={columns} data={jobs} />
        </InfiniteScroll>
      </TableContainer>
    </>
  );
};
export default JobLists;
