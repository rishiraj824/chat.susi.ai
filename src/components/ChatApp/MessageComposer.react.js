import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Send from 'material-ui/svg-icons/content/send';
import Mic from 'material-ui/svg-icons/av/mic';
import Stop from 'material-ui/svg-icons/av/stop';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SpeechRecognition from 'react-speech-recognition';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;
let Button = <Mic />
let ButtonStop = null;
const style = {
    mini: true,
    top: '4px',
    right:'3px',
    position: 'absolute',
};
const styleStop = {
    mini: true,
    top: '4px',
    right:'63px',
    position: 'absolute',
};
class MessageComposer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      speech: false
    };

    if(props.dream!==''){
      this.state= {text: 'dream '+ props.dream}
    }
  }
  componentDidMount(){
    this.nameInput.focus();
  }
  render() {
    const { transcript, browserSupportsSpeechRecognition } = this.props

    if (!browserSupportsSpeechRecognition) {
      return null
    }
    return <div className="message-composer" >
        <textarea
          autoFocus="true"
          name="message"
          value={this.state.speech ? transcript : this.state.text}
          onChange={this._onChange.bind(this)}
          onKeyDown={this._onKeyDown.bind(this)}
          ref={(textarea)=> { this.nameInput = textarea; }}
          placeholder="Type a message..."
          style={{background:this.props.textarea}}
        />
        <IconButton
          iconStyle={{fill:UserPreferencesStore.getTheme()==='light'?'#607D8B':'#fff',
          marginTop:'6px'}}
          onTouchTap={this._onClickButton.bind(this)}
          style={style}>
          {Button}
        </IconButton>
         <IconButton
          iconStyle={{fill:UserPreferencesStore.getTheme()==='light'?'#607D8B':'#fff',
          marginTop:'6px'}}
          onTouchTap={this._stopSpeech.bind(this)}
          style={styleStop}>
          {ButtonStop}
        </IconButton>
        </div>
    }
  _stopSpeech() {
    this.setState({
      speech : false,
      text: this.props.transcript
    });
    this.props.recognition.abort();
    console.log('stopped');
    this.props.resetTranscript();
    Button = <Send />
    ButtonStop = null;
  }
  _onClickButton(){
    if(this.state.text==='') {
      this.setState({speech: true});
      Button = <Mic />
      ButtonStop = <Stop />
    }
    else {
      console.log('stopped');
      Button = <Stop />;
      this._stopSpeech();
      this.props.recognition.continous = false;
      this.props.recognition.abort();
      let text = this.state.text.trim();
      if (text) {
        Actions.createMessage(text, this.props.threadID);
      }
    this.setState({text: ''});
    Button = <Mic />
    }
  }

  _onChange(event, value) {
    this.setState({text: event.target.value});
    Button = <Send />
  }

  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      let text = this.state.text.trim();
      if (text) {
        Actions.createMessage(text, this.props.threadID);
      }
      this.setState({text: ''});
      Button = <Mic />
    }
  }
};

MessageComposer.propTypes = {
  threadID: PropTypes.string.isRequired,
  dream: PropTypes.string,
  speech: PropTypes.bool,
  textarea: PropTypes.string,
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  finalTranscript: PropTypes.string,
  recognition: PropTypes.object,
  browserSupportsSpeechRecognition: PropTypes.bool,
};


export default SpeechRecognition(MessageComposer)

