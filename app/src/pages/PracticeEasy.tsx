import React from 'react'
import FaceAPI, { Emotion } from "../components/faceapi";
import { emotion2emoji, feedbackNotification } from './App';
import { Row, Typography, Button } from "antd";
const { Title } = Typography;

interface IProps {

}

interface IState {
    started: boolean;
    ready: boolean;
    currentEmotion?: Emotion;
    emotionTask?: Emotion;
    correctness?: boolean;
}

export class PracticeEasy extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = { emotionTask: "neutral", correctness: false, started: false, ready: false };
    }
    setEmotion(emotion: Emotion) {
        this.setState({
            currentEmotion: emotion,
            correctness: emotion === this.state.emotionTask
        });
    }
    componentDidUpdate() {
        let newTask: Emotion;
        if (this.state.correctness && this.state.started) {
            if (this.state.emotionTask === "neutral") {
                const emotions: Emotion[] = ['happy', 'sad', 'surprised', 'angry'];
                newTask = emotions[Math.floor((Math.random() * emotions.length))]
            } else {
                newTask = "neutral";
            }
            console.log(`Switching from ${this.state.emotionTask} to ${newTask}`)
            feedbackNotification()
            this.setState({ emotionTask: newTask, correctness: false })
            
        }
    }
    shuffle() {
        this.setState({ emotionTask: "neutral", correctness: true });
    }
    render() {
        return <div style={{marginBottom: "30"}}>
            <Row type="flex" justify="center">
                <Title>Forming Emotions</Title>
            </Row>
            {!this.state.started ? <div><Row type="flex" justify="center"><p>                
                In this step you are going to practice emotional facial expressions. Press start and have fun!
                </p>
            </Row>
                <Row type="flex" justify="center" >
                    <Button
                    onClick={() => this.setState({ started: true })}
                    type="primary"
                    loading={!this.state.ready}
                    >{this.state.ready ? "Start" : "Loading"}</Button>
                </Row>
            </div> : null
            }
            <Row>
                <FaceAPI
                setEmotion={em => this.setEmotion(em)}
                onRunning={() => this.setState({ready: true})}
                ></FaceAPI>
            </Row>
            {this.state.started ? <div>
                <Row type="flex" justify="space-around">
                    <Title>
                        Try to look {this.state.emotionTask} - {emotion2emoji(this.state.emotionTask)}
                    </Title>
                </Row>
                <Row type="flex" justify="center">
                    <Button onClick={() => this.shuffle()} type="primary" size="large">Skip</Button>
                </Row></div> : null
            }
        </div>
    }
}
