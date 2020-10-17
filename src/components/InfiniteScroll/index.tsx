import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import InfiniteScrollComponent from "react-infinite-scroll-component";

type InfiniteScrollProps = {
  items: any[];
  fetchData: any;
  children: React.ReactNode;
  hasMore: boolean;
};

const InfiniteScroll = ({
  items,
  fetchData,
  children,
  hasMore,
}: InfiniteScrollProps) => {
  return (
    <InfiniteScrollComponent
      dataLength={items.length}
      next={fetchData}
      hasMore={hasMore}
      loader={
        <Box textAlign="center" py={4}>
          <Typography>กำลังโหลดข้อมูล...</Typography>
        </Box>
      }
      endMessage={
        <Box textAlign="center" py={4}>
          <Typography>เย้! คุณได้เห็นมันทั้งหมด</Typography>
        </Box>
      }
    >
      {children}
    </InfiniteScrollComponent>
  );
};

export default InfiniteScroll;
