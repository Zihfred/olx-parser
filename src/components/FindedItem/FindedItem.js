import React, { useState } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import styled from "styled-components";

const FindedItem = ({ name, path }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => setClicked(true);

  return (
    <StyledCard clicked={clicked}>
      <CardContent>
        <Typography color="textSecondary" variant="h5">
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`https://www.olx.ua/${path}`} target="_blank">
          <Button size="small" onClick={handleClick}>
            Go to site{" "}
          </Button>
        </Link>
      </CardActions>
    </StyledCard>
  );
};

const Link = styled.a`
  text-decoration: none;
`;

const StyledCard = styled(Card)`
  &&& {
    margin: 10px;
    background: ${(props) =>
      !props.clicked ? "rgba(33, 194, 76, 0.5)" : "rgba(235, 148, 148, 0.5)"};
  }
`;

export default FindedItem;
