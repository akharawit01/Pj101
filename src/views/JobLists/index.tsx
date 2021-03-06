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
import { reqJobs, reqDeleteJob, Job } from "services/job";
import { jobTypeDb, useJobType, JobType } from "services/jobType";
import Report from "../Report";
import { find } from "lodash";
import { formatPrice, formatDistanceDatae } from "utils/misc";

type PagiType = {
  total: number;
  lastVisible?: unknown;
};
type JobFilterProps = {
  name?: string;
  type?: string;
  status?: string;
};
type JobListsProps = {
  customerId?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
    },
  })
);

const JobLists: React.FC<JobListsProps> = (props) => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [fetching, setFetching] = React.useState<boolean>(true);
  const confirm = useConfirm();
  const classes = useStyles();
  const [jobTypes, setJobTypes] = React.useState<JobType[] | any>([]);
  const [filters, setFilters] = React.useState<JobFilterProps>({});
  const [pagi, setPagi] = React.useState<PagiType>({ total: 0 });

  React.useEffect(() => {
    reqJobs(
      { customerId: props?.customerId, ...filters },
      {
        next: (querySnapshot: {
          items: Job[];
          pg: {
            total: number;
            pg: unknown;
          };
        }) => {
          setJobs(querySnapshot.items);
          setPagi(querySnapshot.pg);
          setFetching(false);
        },
        error: () => {
          setFetching(false);
        },
      }
    );
    return () => {
      setJobs([]);
    };
  }, [props, filters]);

  useJobType<JobType>(
    () => jobTypeDb,
    {
      data: (resp) => {
        setJobTypes(resp);
      },
      error: (error) => {
        console.error(error);
      },
    },
    []
  );

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
        isVisible: false,
        accessor: (props: Job) => {
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
        accessor: (props: Job) => {
          return (jobTypes && find(jobTypes, { id: props?.type })?.name) || "-";
        },
        align: "center",
      },
      {
        Header: "จำนวนเงิน (บาท)",
        id: "total",
        accessor: (props: Job) => formatPrice(props.total),
        align: "right",
      },
      {
        Header: "เวลา",
        id: "time",
        align: "right",
        accessor: (props: Job) => {
          return (
            props.updatedAt?.toDate() &&
            formatDistanceDatae(props.updatedAt?.toDate())
          );
        },
      },
      {
        Header: "สถานะ",
        id: "status",
        accessor: (props: Job) => {
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
        accessor: (props: Job) => {
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

      <JobFilter setFilters={setFilters} haveSearchName={!customerId} />

      <TableContainer>
        <InfiniteScroll
          items={jobs}
          fetchData={loadMore}
          hasMore={fetching || !!pagi.lastVisible}
        >
          <Table<Job>
            columns={
              customerId
                ? columns.filter(
                    (column) => customerId && column?.id !== "customerName"
                  )
                : columns
            }
            data={jobs}
          />
        </InfiniteScroll>
      </TableContainer>
    </>
  );
};
export default JobLists;
