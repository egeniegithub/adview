import { Button } from "antd";

export const RenderRetryBtn = ({ getData }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginLeft: "4vw",
      }}
    >
      {
        <Button
          style={{ width: "10vh" }}
          onClick={() => {
            getData();
          }}
        >
          Retry
        </Button>
      }
    </div>
  );
};
