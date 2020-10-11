import React from "react";

type Props = {
  error: {
    message: string;
  };
} & typeof defaultProps;
const defaultProps = {
  error: {},
};

const FullPageErrorFallback = ({ error }: Props) => {
  return (
    <div>
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  );
};
FullPageErrorFallback.defaultProps = defaultProps;

export default FullPageErrorFallback;
