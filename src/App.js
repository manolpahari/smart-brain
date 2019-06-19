import React, { Component } from 'react'
import './App.css';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
 
const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800 
      }
    }
  }
}
const initialState = {
  input: '',
  inputURL:'',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '', 
    name: '',
    email:'',
    password:'',
    entries: 0,
    joined: '',
    pet:'',
    age:''
  }
}
export class App extends Component {
  constructor() {
    super()
    this.state = initialState;
  }

  
  componentDidMount () {
    const token = window.sessionStorage.getItem('token');
    if(token) {
     fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
    .then(resp => resp.json())
    .then( data => {
      if(data && data.id) {
        fetch(`http://localhost:3000/profile/${data.id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : token 
          }
        })
        .then(resp => resp.json())
        .then(user => {
          if(user && user.email) {
            this.loadUser(user)
            this.onRouteChange('home');
          }
        })
      }
    })
    .catch(console.log)
    }
  }


  loadUser = (data) => {
    this.setState({ ...this.state.user, user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: new Date(),
      pet: data.pet,
      age: data.age
    }})
  }

  calculateFaceLocations = (data) => {
    if(data && data.outputs) {
      return data.outputs[0].data.regions.map( face => {
        const clarifaiFace = face.region_info.bounding_box;
        const image = document.getElementById('imageinput');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      })
    }
    return;
  }

  displayFaceboxes = (boxes) => {
    if(boxes){
      this.setState({ boxes: boxes });
    }
  }

  onInputChange = (event) => {
    event.preventDefault();
    this.setState({ input: event.target.value })
  }

  onPictureSubmit = (event) => {
   this.setState({ inputURL: this.state.input })
      fetch('http://localhost:3000/imageurl', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                'Authorization' : window.sessionStorage.getItem('token')
              },
              body: JSON.stringify({
                input: this.state.input
              })
            })
            .then(response => response.json()) 
            .then(response => {
              if(response) {
                fetch('http://localhost:3000/image', {
                  method: 'put',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : window.sessionStorage.getItem('token')
                  },
                  body: JSON.stringify({
                    id: this.state.user.id
                  })
                })
                .then(res => res.json())
                .then(count => {
                  this.setState(Object.assign(this.state.user, {entries: count}))
                })
                .catch(err => console.log(err));
              }
            this.displayFaceboxes(this.calculateFaceLocations(response))})
            .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if(route === 'signout') {
      return this.setState(initialState)
    } else if(route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route})
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen}))
  }

  render() {
  
    const {inputURL, boxes, route, isSignedIn, isProfileOpen, user } = this.state;
    return (
      <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation onRouteChange={this.onRouteChange} 
      isSignedIn={isSignedIn} 
      toggleModal={this.toggleModal}/>
      {
        isProfileOpen && 
      <Modal>
        <Profile isProfileOpen={isProfileOpen} 
        toggleModal={this.toggleModal} 
        user={user}
        loadUser={this.loadUser}
        />
      </Modal>
      }
        { 
          (route === 'home') ?
          <div>
          <Logo/>
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onPictureSubmit={this.onPictureSubmit}
          />
          <FaceRecognition imageURL={inputURL} boxes={boxes}/>
          </div> :
          (
            route === 'signin' ?
            <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> :
            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          ) 
        }

      </div>
    );
  }
}

export default App
