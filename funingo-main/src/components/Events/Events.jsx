import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import birthday from "./images/birthday.jpg";
import bg6 from "./images/bg6.png";
import bg4 from "./images/bg4.png";
import bg5 from "./images/bg5.png";
import "./styles.scss";
import { useNavigate } from "react-router";
import birthdayParty from "./images/birthdayParty.png";
import wedding from "./images/gettogether.jpg";
import babyshowerheading from "./images/babyshowerheading.png";
import babyshower from "./images/kittyparty.jpg";
import prewedding from "./images/prewedding.png";
import { scrollToBottom } from "../../utils";

const eventData = [
  {
    name: "birthday",
    heading: birthdayParty,
    main: birthday,
    bcg: "#FCF892",
    bcImg: bg5,
    marginBottom: "5%",
    content: `At Funingo Adventure Arena, birthdays are more than just celebrations—they're unforgettable adventures! Treat your child to a day filled with excitement and joy as they explore our wide range of thrilling activities, creating memories that will last a lifetime.`,
  },
  {
    name: "babyShower",
    heading: babyshowerheading,
    main: babyshower,
    bcg: "#8AFF77",
    bcImg: bg6,
    marginBottom: "3%",
    content: `Escape the ordinary and indulge in a day of fun and relaxation at Funingo Adventure Arena. Our venue provides the perfect setting for your next kitty party, offering a blend of thrilling adventures and serene surroundings, ensuring a delightful experience for al`,
  },
  {
    name: "preWedding",
    heading: prewedding,
    main: wedding,
    bcg: "#F981C2",
    bcImg: bg4,
    marginBottom: "5%",
    content: `Looking for a venue that offers something unique for 
your next get-together? Look no further than Funingo 
Adventure Arena. Whether you're reconnecting with friends 
or bringing together family, our park offers a diverse range 
of activities and experiences, promising a day filled with 
laughter, joy, and shared memories`,
  },
];

const Events = () => {
  const navigate = useNavigate();
  return (
    <Grid className="events">
      {/* first box */}
      <Grid height="70vh" className="top">
        <Typography height="60vh" className="heading">
          EVENTS
        </Typography>
      </Grid>

      {eventData.map((data, i) => (
        <Grid
          key={data.name}
          className="top2"
          flexDirection={i % 2 === 0 ? "row" : "row-reverse"}
          marginBottom={data.marginBottom}
        >
          <img
            src={data.bcImg}
            alt="background-img"
            className="background-event"
          />
          <Grid className="first">
            <Box
              component={"img"}
              sx={{ borderRadius: "10px" }}
              className="main-img"
              src={data.main}
              alt={"Event"}
            />
          </Grid>
          <Grid className="second" marginRight={i % 2 ? "50px" : "0px"}>
            <Grid className="top-box">
              <img
                className="heading-img"
                src={data.heading}
                alt={"Event heading"}
              />
            </Grid>
            <Grid className="content-box">
              <h4>{data.content}</h4>
            </Grid>
            <Button
              variant="contained"
              sx={{
                background: "#2CC248",
                boxShadow: "0px 2.5 9 0px rgba(0, 0, 0, 0.25)",
                borderRadius: "50px",
                padding: "20px 50px",
                fontFamily: "Luckiest Guy",
                fontSize: "24px",
                marginTop: "20px",
                marginLeft: "20px",

                "&:hover": {
                  background: "#1e8e33",
                },
              }}
              onClick={() => {
                scrollToBottom();
              }}
            >
              <p> Book Now </p>
            </Button>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Events;
