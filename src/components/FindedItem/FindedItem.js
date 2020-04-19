import React, {useState} from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import styled from "styled-components";

const FindedItem = ({ name, path }) => {
  const [clicked,setClicked] = useState(false);

  const handleClick = () => setClicked(true);

  return (
    <StyledCard  clicked={clicked}>
      <CardContent>
        <Typography color="textSecondary" variant="h3">
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small"  onClick={handleClick}>
          <Link href={`https://www.olx.ua/${path}`} target="_blank" >Go to site</Link>
        </Button>
      </CardActions>
    </StyledCard>
  );
};

const Link = styled.a`
text-decoration: none;
`

const StyledCard = styled(Card)`
&&&{
  background: ${props => props.clicked  ? 'green' : 'rgba(235, 148, 148, 1)'};
  }
`

export default FindedItem;
