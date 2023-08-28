import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";

export type Props = {};

export default function Welcome({}: Props) {
  return (
    <Html>
      <Head />
      <Preview>👋 Welcome to A/BBY!</Preview>
      <Section style={main}>
        <Container style={container}>
          Hey there,
          <br />
          <br />
          thank you very much for signing up for A/BBY!
          <br />
          We're excited to have you on board.
          <br />I can highly recommend you to check out our{" "}
          <a href="https://docs.tryabby.com">documentation</a> to get started
          with A/BBY.
          <br />
          <br />
          If you ever need a hand feel free to reply to this email or book a 1:1
          call with me{" "}
          <a href="https://cal.com/tim-raderschad/abby-feedback?duration=15">
            here
          </a>
          .
          <br />
          <br />
          <br />
          Tim Raderschad
          <br />
          Founder of A/BBY
          <br />
          <br />
          P.S. This email is automated but I will reply to your response {":)"}
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
};

const container = {
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  margin: "40px auto",
  padding: "20px",
  width: "465px",
};
