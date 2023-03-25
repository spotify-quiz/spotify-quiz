import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Image from 'next/image'
import AudioPlayer from './AudioPlayer';

function ResultDialog(props: any) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <Container className="p-3">
          <Row>
            <h1>{props.title}</h1>
          </Row>
          <Row className="mt-4 mb-4">
            <Col>
              <Image
                src={props.track?.album[0]?.url}
                height="200"
                width="200"
                alt="Song"
              />
            </Col>
            <Col className="d-flex flex-column  justify-content-between">
              <h3>{props.track?.name}</h3>
              <h5>{props.track?.artists?.[0]?.name}</h5>
              <h5>{props.track?.album?.name}</h5>
              <AudioPlayer
                audio={props.audio}
                volume={props.volume}
                setVolume={(newVolume: number) => {
                  /* Implement setVolume logic here */
                }}
                playing={props.playing}
                setPlaying={props.setPlaying}
                showVolume={false}
                setStartTimer={(value: boolean) => {
                  /* Implement setStartTimer logic here */
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <p style={{ width: 'auto' }}>
              <b>Score: </b>
              {props.score}
              <span> (+{props.addedScore})</span>
            </p>
          </Row>
          <Row className="justify-content-center">
            <Button
              className="dialog-button w-50 rounded-5"
              size="lg"
              onClick={props.onHide}
              style={{ backgroundColor: 'white', border: 'transparent' }}
            >
              <b>Close</b>
            </Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default ResultDialog;
