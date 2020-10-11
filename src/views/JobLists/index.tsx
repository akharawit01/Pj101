import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import { useConfirm } from "material-ui-confirm";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import numeral from "numeral";
import { formatDistance } from "date-fns";
import { Table } from "components";
import JobEdit from "../JobEdit";
import { StatusChip, JobFilter } from "components";
import { reqJobs, reqDeleteJob } from "services/job";
import { reqJobTypes } from "services/jobType";
import Report from "../Report";
import { find } from "lodash";
import { th } from "date-fns/locale";

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

  React.useEffect(() => {
    reqJobs(
      { customerId: props?.customerId, ...filters },
      {
        next: (querySnapshot: any) => {
          setJobs(querySnapshot);
          setFetching(false);
        },
      }
    );
  }, [props, filters]);

  React.useEffect(() => {
    reqJobTypes().then((resp) => {
      setJobTypes(resp);
    });
  }, []);

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
        accessor: (props: any) => {
          return (jobTypes && find(jobTypes, { id: props?.type })?.name) || "-";
        },
        align: "center",
      },
      {
        Header: "จำนวนเงิน (บาท)",
        accessor: (props: any) => numeral(props.total).format("0,0.00"),
        align: "right",
      },
      {
        Header: "เวลา",
        align: "right",
        accessor: (props: any) => {
          return (
            props.updatedAt?.toDate() &&
            formatDistance(props.updatedAt?.toDate(), new Date(), {
              locale: th,
            })
          );
        },
      },
      {
        Header: "สถานะ",
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

      <Table columns={columns} data={jobs} />
      {fetching && (
        <Skeleton variant="rect" width="100%">
          <div style={{ paddingTop: "50%" }} />
        </Skeleton>
      )}
      {/* {!fetching && !jobs.length && (
        <Box textAlign="center" py={10}><Typography>ไม่มีข้อมูล</Typography></Box>
      )} */}
    </>
  );
};
export default JobLists;
